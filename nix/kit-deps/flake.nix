{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    marble = {
      url = "git+ssh://git@github.com/marble-shell/kit";
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

      kitDeps = pkgs.stdenv.mkDerivation rec {
        pname = "marble-kit-deps";
        name = "marble-kit-deps";
        src = inputs.marble;

        pnpmDeps = pkgs.fetchPnpmDeps {
          inherit pname src;
          fetcherVersion = 3;
          hash = "sha256-3T2Q++lS4KCgA3ckhRXbvFxC4CiqJ2LaPAiZSHkU0j8=";
        };

        installPhase = ''
          mkdir -p $out/share
          cp -r $pnpmDeps/* $out/share
        '';
      };
    in {
      default = kitDeps;
      marbleKitDepsHook = pkgs.stdenv.mkDerivation {
        name = "marble-kit-deps-hook";
        dontUnpack = true;
        dontBuild = true;
        propagateNativeBuildInputs = with pkgs; [
          pnpm
        ];
        installPhase = ''
          mkdir -p $out/nix-support
          cat > $out/nix-support/setup-hook <<'EOF'
            postConfigureHooks+=(marbleKitDepsHook)

            marbleKitDepsHook() {
              pnpm --offline remove marble || true

              tar xf ${kitDeps}/share/* -C "\$(pnpm store path)"
              pnpm --offline add ${inputs.marble} \
                --config.confirmModulesPurge=false
            }
          EOF
        '';
      };
    });
  };
}
