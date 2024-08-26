![ci](https://github.com/lbryfoundation/bookbuddies/actions/workflows/ci.yaml/badge.svg?branch=main&event=push)

# bookbuddies

A project by the LBRY Foundation to allow you to seed relevant LBRY content, so the network becomes more decentralised!

## Running

Download the correct binary for your system from here, and run it.

> [!IMPORTANT]
> If you see an 'Illegal Instruction' error, this likely means your CPU does not support modern instructions. If this happens, you should use a slower but compatible `baseline` build from the [Releases](https://github.com/lbryfoundation/bookbuddies/releases) page.

| Platform | Architecture | UI  | Link                                                                                            |
| -------- | ------------ | --- | ----------------------------------------------------------------------------------------------- |
| Windows  | x64          | GUI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/windows-x64-gui.exe) |
| Windows  | x64          | CLI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/windows-x64-cli.exe) |
| macOS    | Universal    | GUI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/macos-gui)           |
| macOS    | Universal    | CLI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/macos-cli)           |
| Linux    | x64          | GUI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/linux-x64-gui)       |
| Linux    | x64          | CLI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/linux-x64-cli)       |
| Linux    | arm64        | GUI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/linux-arm64-gui)     |
| Linux    | arm64        | CLI | [Download](https://github.com/lbryfoundation/bookbuddies/releases/download/linux-arm64-cli)     |

### Should I choose GUI or CLI?

The GUI (graphical user interface) version functions like a standard desktop app, with visual elements to click on with the mouse.

The CLI (command-line interface) version runs in the terminal.

The GUI is best if you're running bookbuddies on your personal computer, since it can run in the background easily. If you want to run it on a server instead, and you are familiar with applications in the console, the CLI may be a better choice.

## Setup

You'll only need to do this if you're planning to [build](#building) or [contribute](#contributing). If you want to run bookbuddies easily, you can [download it from the latest release](https://github.com/lbryfoundation/bookbuddies/releases).

> [!IMPORTANT]
> Make sure you have [Git](https://git-scm.com/) and [Bun](https://bun.sh/) installed first.

1. Clone the repository.
   ```sh
   git clone https://github.com/lbryfoundation/bookbuddies.git
   ```
2. Switch to the newly made `bookbuddies` folder.
   ```sh
   cd bookbuddies
   ```
3. Install all dependencies.
   ```sh
   bun i
   ```

<details>
<summary>All together (copy and paste)</summary>

```sh
git clone https://github.com/lbryfoundation/bookbuddies.git
cd bookbuddies
bun i
```

</details>

## Building

Run the build command for the binary you want to make.

```sh
bun build:cli
bun build:gui
```

This will compile for the platform you are on. If you want to compile for a different platform, you can add a [supported target](https://bun.sh/docs/bundler/executables#cross-compile-to-other-platforms).

Windows ARM devices are currently unsupported.

## Contributing

Contributions, including non-code ones, are welcome! See more in the [contributing](CONTRIBUTING.md) file.

## Security

If you spot a vulnerability, you can disclose it safely in accordance with the [security](SECURITY.md) file.
