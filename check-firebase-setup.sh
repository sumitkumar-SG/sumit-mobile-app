#!/bin/bash
echo "🔍 Checking Firebase Setup..."
echo ""

# Check if file exists
if [ -f "ios/GoogleService-Info.plist" ]; then
  echo "✅ GoogleService-Info.plist exists in ios/ directory"
else
  echo "❌ GoogleService-Info.plist NOT found in ios/ directory"
  exit 1
fi

# Check if file is in Xcode project
if grep -q "GoogleService-Info.plist" ios/AwesomeProject.xcodeproj/project.pbxproj 2>/dev/null; then
  echo "✅ GoogleService-Info.plist is referenced in Xcode project"
else
  echo "❌ GoogleService-Info.plist is NOT in Xcode project"
  echo ""
  echo "⚠️  ACTION REQUIRED:"
  echo "   1. Open ios/AwesomeProject.xcworkspace in Xcode"
  echo "   2. Right-click AwesomeProject folder → Add Files to AwesomeProject"
  echo "   3. Select ios/GoogleService-Info.plist"
  echo "   4. Ensure 'Add to targets: AwesomeProject' is CHECKED"
  echo "   5. Click Add"
  exit 1
fi

echo ""
echo "✅ Firebase setup looks good!"
