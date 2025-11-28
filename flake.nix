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

    sshKey = {
      url = "git+ssh://git@github.com/aylur/vault?dir=ssh/id_rsa";
      flake = false;
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
      default = pkgs.stdenv.mkDerivation rec {
        pname = "marble";
        name = "marble";
        src = ./.;

        pnpmDeps = pkgs.pnpm.fetchDeps {
          inherit pname src;
          fetcherVersion = 2;
          hash = "sha256-IACKjB8RkZMBhJDeZoYIdduVF/F9zhVdSFWli6naR1U=";
          sshKey = inputs.sshKey;
          prePnpmInstall = ''
            export PATH="$PATH:${pkgs.git}/bin":${pkgs.openssh}/bin
            eval "$(ssh-agent -s)"
            ssh-add $sshKey
            export GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"
          '';
        };

        nativeBuildInputs = [
          pkgs.wrapGAppsHook4
          pkgs.gobject-introspection
          pkgs.pnpm.configHook
          inputs.marble.packages.${system}.marbleSetupHook
          inputs.ags.packages.${system}.default
        ];

        installPhase = ''
          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r data/* $out/share
          ags bundle app.ts $out/bin/marble -d "import.meta.PKG_DATADIR='$out/share'"
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
