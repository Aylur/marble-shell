# Marble Shell

A Wayland Desktop Shell.

![Desktop](https://marble-shell.pages.dev/full.png)

> [!IMPORTANT]
>
> ## Sponsorware Notice
>
> Although _this repository_ is open source, it depends on
> [Marble Kit](https://marble-shell.pages.dev/), which is a paid project. To run
> this project, you will need access to Marble, which you can obtain by becoming
> a [sponsor](https://github.com/sponsors/Aylur). Make sure to read the
> [license](https://marble-shell.pages.dev/license) and
> [usage guide](https://marble-shell.pages.dev/guide) before sponsoring.

## Installation

Arch-based distributions and Nix are supported out of the box. On other
distributions, you may need to compile some dependencies from source.

> [!NOTE]
>
> Currently some components are only supported on **Hyprland**. Support for
> other compositors are **WIP**.

### Arch

1. Install dependencies

   ```sh
   yay -S aylurs-gtk-shell-git libastal-meta fzf brightnessctl pnpm \
     libadwaita gtk4-layer-shell glycin glycin-gtk4 evolution-data-server
   ```

2. Clone this repository

   ```sh
   git clone https://github.com/aylur/marble-shell
   cd marble-shell
   ```

3. Install npm dependencies

   ```sh
   pnpm install
   ```

4. Run with `ags`

   ```sh
   ags run app.ts
   ```

Optionally, you can bundle it and install system/user wide:

```sh
out="$HOME/.local"

mkdir -p $out/bin
mkdir -p $out/share
cp -r data/* $out/share
ags bundle app.ts $out/bin/marble -d "import.meta.PKG_DATADIR='$out/share'"

# make sure "$HOME/.local/bin" is in $PATH
marble --help
```

To install system wide you can set `$out` to `/usr`. This is generally not
recommended though, as you should let your package manager to manage system wide
packages. Instead install to `/usr/local` and make sure `/usr/local/bin` is in
`$PATH`.

> [!IMPORTANT]
>
> ## Marble License Reminder
>
> Don't publish bundles and don't publish the `node_modules/marble` directory.

### Nix

1. Include this repo as an input to your flake.

   ```nix
   # flake.nix
   {
     inputs = {
       marble-shell.url = "git+ssh://git@github.com/Aylur/marble-shell";
     };
   }
   ```

2. Override the package and include your ssh key.

   ```nix
   inputs: let
   { pkgs, inputs, ... }: let
     marble = inputs.marble-shell.packages.${pkgs.system}.default;
     marble-shell = marble.overrideAttrs (prev: {
       pnpmDeps = prev.pnpmDeps.overrideAttrs {
         sshKey = ./path/to/sshkey;
       };
     });
   in {
     # using home-manager
     home.packages = [marble-shell];

     # using configuration.nix
     environment.systemPackages = [marble-shell];
   }
   ```

> [!TIP]
>
> If your flake is in a public repo, you can hide your ssh key by pushing it
> into a private repo and having it as another input to your public flake.
