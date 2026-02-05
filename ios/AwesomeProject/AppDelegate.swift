import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Security
import Firebase
import FirebaseCore
import FirebaseMessaging
import UserNotifications
import FirebaseRemoteConfig

@main
class AppDelegate: UIResponder, UIApplicationDelegate, MessagingDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // Setup Firebase based on env
    var firebasePlistName = "GoogleService-Info"

    if let filePath = Bundle.main.path(forResource: firebasePlistName, ofType: "plist"),
       let options = FirebaseOptions(contentsOfFile: filePath) {
      FirebaseApp.configure(options: options)
    } else {
      print(" Invalid Firebase configuration file.")
    }

    // Setup Notifications
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      print("Notification permission granted: \(granted)")
    }
    application.registerForRemoteNotifications()

    // Setup Firebase Messaging delegate
    Messaging.messaging().delegate = self

    // Clear keychain if necessary (preserving existing functionality)
    clearKeychainIfNecessary()

    // Setup React Native
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "AwesomeProject",
      in: window, initialProperties: [:],
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - Firebase Messaging Delegate Methods

  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("Firebase registration token: \(String(describing: fcmToken))")

    let dataDict: [String: String] = ["token": fcmToken ?? ""]
    NotificationCenter.default.post(
      name: Notification.Name("FCMToken"),
      object: nil,
      userInfo: dataDict
    )
  }

  // MARK: - Remote Notification Methods

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("APNs token retrieved: \(deviceToken)")

    // With swizzling disabled you must set the APNs token here.
    Messaging.messaging().apnsToken = deviceToken
  }

  // Handle notification when app is launched from a terminated state
  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    print("Received remote notification: \(userInfo)")

    // Let FCM know about the message for analytics
    Messaging.messaging().appDidReceiveMessage(userInfo)

    completionHandler(.newData)
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error)")
  }

  // MARK: - UNUserNotificationCenterDelegate Methods

  // Called when a notification is delivered to a foreground app
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo

    // Print full message
    print("Received notification in foreground: \(userInfo)")

    // Change this to your preferred presentation option
    completionHandler([[.banner, .badge, .sound]])
  }

  // Called when user taps on notification
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    let userInfo = response.notification.request.content.userInfo

    // Print full message
    print("User tapped on notification: \(userInfo)")

    completionHandler()
  }

  /**
   Deletes all Keychain items accessible by this app if this is the first time the user launches the app
   */
  private func clearKeychainIfNecessary() {
    // Check whether or not this is the first time the app is run
    if !UserDefaults.standard.bool(forKey: "HAS_RUN_BEFORE") {
      // Set the appropriate value so we don't clear next time the app is launched
      UserDefaults.standard.set(true, forKey: "HAS_RUN_BEFORE")

      let secItemClasses = [
        kSecClassGenericPassword,
        kSecClassInternetPassword,
        kSecClassCertificate,
        kSecClassKey,
        kSecClassIdentity
      ]

      // Maps through all Keychain classes and deletes all items that match
      for secItemClass in secItemClasses {
        let spec = [kSecClass: secItemClass]
        SecItemDelete(spec as CFDictionary)
      }
    }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
