{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };

    marble = {
      url = "git+ssh://git@github.com/marble-shell/kit";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    ...
  }: let
    forAllSystems = nixpkgs.lib.genAttrs ["x86_64-linux" "aarch64-linux"];
  in {
    packages = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = let
        srcWithKit = pkgs.runCommand "marble-src-with-kit" {
          src = ./.;
        } ''
          cp -r --no-preserve=mode $src $out
          cat $src/nix/pnpm-lock.yaml > $out/pnpm-lock.yaml
          cat $src/nix/package.json > $out/package.json
          cp -r --no-preserve=mode ${inputs.marble} $out/nix/kit
        '';

        pname = "marble";
        src = srcWithKit;
      in pkgs.stdenv.mkDerivation {
        inherit pname src;
        name = pname;

        pnpmDeps = pkgs.fetchPnpmDeps {
          inherit pname src;
          fetcherVersion = 3;
          hash = "sha256-HuXDvLd5t9tS3+PnHdKMQ8Cm3B7zUAfCTCkyP6xOnTg=";
        };

        nativeBuildInputs = [
          pkgs.wrapGAppsHook4
          pkgs.gobject-introspection
          pkgs.pnpm.configHook
          inputs.marble.packages.${system}.marbleSetupHook
          inputs.ags.packages.${system}.default
        ];

        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r data/* $out/share
          ags bundle app.ts $out/bin/marble -d "import.meta.PKG_DATADIR='$out/share'"

          runHook postInstall
        '';
      };
    });

    devShells = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.pnpm
          (inputs.ags.packages.${system}.default.override {
            extraPackages = [
              inputs.marble.packages.${system}.marbleSetupHook
            ];
          })
        ];
      };
    });
  };
}
