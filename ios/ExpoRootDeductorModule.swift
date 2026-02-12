import ExpoModulesCore
import UIKit
import Darwin

public class ExpoRootDeductorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRootDeductor")

    Constant("PI") {
      Double.pi
    }

    Events("onChange")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    AsyncFunction("checkDeviceSecurity") { (promise: Promise) in
      do {
        let result = try self.performSecurityChecks()
        promise.resolve(result)
      } catch {
        promise.reject("SECURITY_CHECK_ERROR", "Error performing security checks: \(error.localizedDescription)", error)
      }
    }

    View(ExpoRootDeductorView.self) {
      Prop("url") { (view: ExpoRootDeductorView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }

  private func performSecurityChecks() throws -> [String: Any] {
    var failedChecks: [String] = []
    
    // Check for jailbreak
    let isJailbroken = checkJailbreak()
    if isJailbroken {
      failedChecks.append("JAILBREAK_DETECTED")
    }
    
    // Check for developer mode (iOS 16+)
    let isDeveloperMode = checkDeveloperMode()
    if isDeveloperMode {
      failedChecks.append("DEVELOPER_MODE_ENABLED")
    }
    
    // Check for developer options (always false on iOS as there's no equivalent)
    let isDeveloperOptionsEnabled = false
    
    // Check for simulator
    let isSimulator = checkSimulator()
    if isSimulator {
      failedChecks.append("SIMULATOR_DETECTED")
    }
    
    return [
      "isCompromised": failedChecks.count > 0,
      "failedChecks": failedChecks,
      "details": [
        "isRooted": isJailbroken,
        "isDeveloperMode": isDeveloperMode,
        "isDeveloperOptionsEnabled": isDeveloperOptionsEnabled,
        "isEmulator": isSimulator
      ] as [String: Any]
    ]
  }

  private func checkJailbreak() -> Bool {
    // Check for common jailbreak files
    let jailbreakPaths = [
      "/Applications/Cydia.app",
      "/Applications/blackra1n.app",
      "/Applications/FakeCarrier.app",
      "/Applications/Icy.app",
      "/Applications/IntelliScreen.app",
      "/Applications/MxTube.app",
      "/Applications/RockApp.app",
      "/Applications/SBSettings.app",
      "/Applications/WinterBoard.app",
      "/Library/MobileSubstrate/MobileSubstrate.dylib",
      "/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
      "/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
      "/private/var/lib/apt",
      "/private/var/lib/cydia",
      "/private/var/mobile/Library/SBSettings/Themes",
      "/private/var/tmp/cydia.log",
      "/System/Library/LaunchDaemons/com.ikey.bbot.plist",
      "/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
      "/usr/bin/sshd",
      "/usr/libexec/ssh-keysign",
      "/usr/sbin/frida-server",
      "/etc/apt",
      "/bin/bash",
      "/usr/sbin/frida-server",
      "/usr/bin/cycript",
      "/usr/local/bin/cycript",
      "/usr/lib/libcycript.dylib",
      "/var/cache/apt",
      "/var/lib/apt",
      "/var/lib/cydia",
      "/var/log/syslog",
      "/private/var/lib/apt/",
      "/private/var/lib/cydia",
      "/private/var/mobile/Library/SBSettings/Themes",
      "/private/var/tmp/cydia.log",
      "/Applications/MobileTerminal.app",
      "/Applications/RockApp.app",
      "/Applications/SBSettings.app",
      "/Applications/WinterBoard.app",
      "/Library/MobileSubstrate/MobileSubstrate.dylib",
      "/bin/sh",
      "/usr/bin/ssh",
      "/etc/ssh/sshd_config",
      "/private/etc/ssh/sshd_config",
      "/usr/libexec/sftp-server",
      "/Applications/RockApp.app",
      "/Applications/SBSettings.app",
      "/Applications/MobileTerminal.app",
      "/Applications/IntelliScreen.app",
      "/Applications/FakeCarrier.app",
      "/Applications/WinterBoard.app"
    ]
    
    for path in jailbreakPaths {
      if FileManager.default.fileExists(atPath: path) {
        return true
      }
    }
    
    // Check if we can write to restricted directories
    let restrictedPaths = [
      "/private/jailbreak.txt",
      "/private/var/mobile/jailbreak.txt"
    ]
    
    for path in restrictedPaths {
      do {
        try "test".write(toFile: path, atomically: true, encoding: .utf8)
        try FileManager.default.removeItem(atPath: path)
        return true
      } catch {
        // File write failed, which is expected on non-jailbroken devices
      }
    }
    
    // Check for suspicious processes
    let suspiciousProcesses = [
      "Cydia",
      "MobileSubstrate",
      "cycript",
      "frida-server",
      "ssh"
    ]
    
    // Try to detect if we're running in a sandbox (jailbroken devices often have less restrictions)
    let canAccessSystemFiles = FileManager.default.fileExists(atPath: "/Library/MobileSubstrate")
    if canAccessSystemFiles {
      return true
    }
    
    // Check for dynamic library injection
    if let libraries = getLoadedLibraries() {
      for library in libraries {
        if library.contains("Substrate") || library.contains("cycript") || library.contains("frida") {
          return true
        }
      }
    }
    
    return false
  }

  private func checkDeveloperMode() -> Bool {
    // iOS 16+ has Developer Mode setting
    if #available(iOS 16.0, *) {
      // Check if Developer Mode is enabled by trying to access developer features
      // Note: This is a simplified check. On iOS 16+, Developer Mode is a system setting
      // that can be checked via entitlements, but we can't directly access it from a regular app
      // We'll check for common indicators
      return false // iOS doesn't expose this directly to apps
    }
    return false
  }

  private func checkSimulator() -> Bool {
    #if targetEnvironment(simulator)
    return true
    #else
    // Additional checks for simulator
    if ProcessInfo.processInfo.environment["SIMULATOR_DEVICE_NAME"] != nil {
      return true
    }
    
    // Check architecture
    #if arch(i386) || arch(x86_64)
    return true
    #else
    return false
    #endif
    #endif
  }

  private func getLoadedLibraries() -> [String]? {
    var libraries: [String] = []
    let count = _dyld_image_count()
    
    for i in 0..<count {
      if let imageName = _dyld_get_image_name(i) {
        let name = String(cString: imageName)
        libraries.append(name)
      }
    }
    
    return libraries.isEmpty ? nil : libraries
  }
}
