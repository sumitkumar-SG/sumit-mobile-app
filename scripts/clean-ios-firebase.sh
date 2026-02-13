#!/bin/bash

# Clean iOS Firebase build script
# Run this after making Firebase configuration changes

echo "🧹 Cleaning iOS build artifacts..."

cd "$(dirname "$0")/.."

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/AwesomeProject-*

# Clean iOS build folder
rm -rf ios/build

# Clean Pods (optional - uncomment if you want a full clean)
# rm -rf ios/Pods ios/Podfile.lock

echo "✅ Clean complete!"
echo ""
echo "Next steps:"
echo "1. cd ios && pod install"
echo "2. npx react-native run-ios"

