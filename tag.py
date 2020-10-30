import argparse
import subprocess

parser = argparse.ArgumentParser(description="👷 Auto-version using a triple of integer version numbers.")
parser.add_argument("-v", "--version", action='store_true')
parser.add_argument("type", nargs="?", default="", help="The version type that will be added")
parser.add_argument("--message", required=False)
args = parser.parse_args()

def main():
    version = subprocess.check_output(["git", "describe"], text=True).split("-")[0].replace("v", "").strip().split(".")
    if len(version) != 3:
        print("❌ Illformated semantic version tag encountered")
        print("💁‍♀️ Please create a valid semantic version tag manually and push it!")
        print("🚪 Exiting.")
        return 1
    if args.type in ["get"]:
        print(version_str(version))
        return 0
    if args.type in ["major", "maj", "M"]:
        print("👑 Adding new major version")
        message = args.message if args.message else "🎉✨ New major version"
        version[2] = "0"
        version[1] = "0"
        version[0] = str(int(version[0]) + 1)
        v = git_hook(version, message)
    elif args.type in ["minor", "min", "m"]:
        print("✨ Adding new minor version")
        message = args.message if args.message else "💡🔥 New minor version"
        version[2] = "0"
        version[1] = str(int(version[1]) + 1)
        v = git_hook(version, message)
    elif args.type in ["patch", ""]:
        print("🩹 Adding new patch version")
        message = args.message if args.message else "🩹♻️ New patch"
        version[2] = str(int(version[2]) + 1)
        v = git_hook(version, message)
    else:
        print("❌ Invalid version type supplied")
        print("🙅 Not creating new version tag")
        return 3
    print("📦 Version stands at {}".format(v))
    print("🚪 Exiting.")

def git_hook(version, message):
    v = version_str(version)
    subprocess.run(["git", "tag", "-a", "v{}".format(v), "-m", "{}: [{}]".format(message, v)])
    subprocess.run(["git", "push", "--tags"])
    print("☝️ Created and pushed new version tag!")
    print("  Currently at:")
    print("  {}: {}: [{}]".format(v, message, v))
    return v

def version_str(version):
    return "{}.{}.{}".format(version[0], version[1], version[2])

if __name__ == "__main__":
    main()