#!C:\Python38\python.exe
import argparse
import subprocess

parser = argparse.ArgumentParser(description="👷 Auto-version using a triple of integer version numbers.")
parser.add_argument("-v", "--version", action='store_true')
parser.add_argument("type", nargs="?", default="", help="The version type that will be added")
parser.add_argument("--message", required=False)
args = parser.parse_args()

def main():

    with open(".version", "rt+") as f:
        version = f.read().split(".")
        if len(version) != 3:
            print("❌ Corrupted version file encountered")
            print("🚪 Exiting.")
            return 1
        v=version_str(version)
        if args.type in ["major", "maj", "M"]:
            print("👑 Adding new major version")
            message = args.message if args.message else "🎉✨ New major version"
            version[2] = "0"
            version[1] = "0"
            version[0] = str(int(version[0]) + 1)
            v = git_hook(version, message)
            f.write(v)
        elif args.type in ["minor", "min", "m"]:
            print("✨ Adding new minor version")
            message = args.message if args.message else "💡🔥 New minor version"
            version[2] = "0"
            version[1] = str(int(version[1]) + 1)
            v = git_hook(version, message)
            f.write(v)
        elif args.type in ["patch", ""]:
            print("🩹 Adding new patch version")
            message = args.message if args.message else "🩹♻️ Patch"
            version[2] = str(int(version[2]) + 1)
            v = git_hook(version, message)
            f.write(v)
        elif args.type in ["get"]:
            v = subprocess.check_output(["git", "describe"], text=True).split("-")[0].replace("v", "").strip()
            print(v)
            f.write(v)
            f.close()
            return
        else:
            print("❌ Invalid version type supplied")
            print("🙅 Not creating new version tag")
        print("📦 Version stands at {}".format(v))
        print("🚪 Exiting.")
    except IOError:
        print("❌ .version file not present!")
        print("🖌 creating it from current git tag")
        f = open(".version", "wt")
        f.write(
            subprocess.check_output(["git", "describe"], text=True).split("-")[0].replace("v", "").strip())
        f.close()

def git_hook(version, message):
    v = version_str(version)
    subprocess.run(["git", "tag", "-a", "v{}".format(v), "-m", "{}: [{}]".format(message, v)])
    subprocess.run(["git", "push", "--tags"])
    subprocess.run(["git", "commit", "--amend", "-q", "./.version"])
    print("☝️ Created and pushed new version tag!")
    print("  Currently at:")
    print("  {}: {}: [{}]".format(v, message, v))
    return v

def version_str(version):
    return "{}.{}.{}".format(version[0], version[1], version[2])

if __name__ == "__main__":
    main()