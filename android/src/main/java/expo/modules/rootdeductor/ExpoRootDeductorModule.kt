package expo.modules.rootdeductor

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.io.File
import android.os.Build
import android.provider.Settings

class ExpoRootDeductorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoRootDeductor")

    AsyncFunction("checkDeviceSecurity") { promise: Promise ->
      try {
        val result = performSecurityChecks()
        promise.resolve(result)
      } catch (e: Exception) {
        promise.reject("SECURITY_CHECK_ERROR", "Error performing security checks: ${e.message}", e)
      }
    }
  }

  private fun performSecurityChecks(): Map<String, Any> {
    val failedChecks = mutableListOf<String>()
    
    val isRooted = checkRoot()
    if (isRooted) {
      failedChecks.add("ROOT_DETECTED")
    }
    
    val isDeveloperMode = checkDeveloperMode()
    if (isDeveloperMode) {
      failedChecks.add("DEVELOPER_MODE_ENABLED")
    }
    
    val isDeveloperOptionsEnabled = checkDeveloperOptions()
    if (isDeveloperOptionsEnabled) {
      failedChecks.add("DEVELOPER_OPTIONS_ENABLED")
    }
    
    val isEmulator = checkEmulator()
    if (isEmulator) {
      failedChecks.add("EMULATOR_DETECTED")
    }
    
    return mapOf(
      "isCompromised" to (failedChecks.isNotEmpty()),
      "failedChecks" to failedChecks,
      "details" to mapOf(
        "isRooted" to isRooted,
        "isDeveloperMode" to isDeveloperMode,
        "isDeveloperOptionsEnabled" to isDeveloperOptionsEnabled,
        "isEmulator" to isEmulator
      )
    )
  }

  private fun checkRoot(): Boolean {
    val rootIndicators = listOf(
      "/system/app/Superuser.apk",
      "/sbin/su",
      "/system/bin/su",
      "/system/xbin/su",
      "/data/local/xbin/su",
      "/data/local/bin/su",
      "/system/sd/xbin/su",
      "/system/bin/failsafe/su",
      "/data/local/su",
      "/su/bin/su",
      "/system/xbin/daemonsu",
      "/system/etc/init.d/99SuperSUDaemon",
      "/dev/com.koushikdutta.superuser.daemon/",
      "/system/etc/.has_su_daemon",
      "/system/etc/.installed_su_daemon",
      "/system/bin/.ext/.su",
      "/system/usr/we-need-root/su-backup",
      "/system/xbin/mu",
      "/system/xbin/busybox",
      "/system/bin/busybox",
      "/data/local/busybox",
      "/data/local/tmp/busybox",
      "/data/data/com.noshufou.android.su",
      "/data/data/com.thirdparty.superuser",
      "/data/data/eu.chainfire.supersu",
      "/data/data/com.koushikdutta.rommanager",
      "/data/data/com.koushikdutta.rommanager.license",
      "/data/data/com.dimonvideo.luckypatcher",
      "/data/data/com.chelpus.lackypatch",
      "/data/data/com.ramdroid.appquarantine",
      "/data/data/com.ramdroid.appquarantinepro",
      "/data/data/com.devadvance.rootcloak",
      "/data/data/com.devadvance.rootcloakplus",
      "/data/data/de.robv.android.xposed.installer",
      "/data/data/com.saurik.substrate",
      "/data/data/com.zachspong.temprootremovejb",
      "/data/data/com.amphoras.hidemyroot",
      "/data/data/com.amphoras.hidemyrootadfree",
      "/data/data/com.formyhm.hiderootPremium",
      "/data/data/com.formyhm.hideroot",
      "/data/data/me.phh.superuser",
      "/data/data/com.koushikdutta.superuser",
      "/data/data/com.kingouser.com",
      "/data/data/com.topjohnwu.magisk"
    )

    for (path in rootIndicators) {
      if (File(path).exists()) {
        return true
      }
    }

    // Check for su command availability
    try {
      val process = Runtime.getRuntime().exec(arrayOf("which", "su"))
      val reader = process.inputStream.bufferedReader()
      val result = reader.readLine()
      reader.close()
      process.waitFor()
      if (result != null && result.isNotEmpty()) {
        return true
      }
    } catch (e: Exception) {
      // Ignore exceptions
    }

    // Check for test keys (indicates custom ROM)
    try {
      val buildTags = Build.TAGS
      if (buildTags != null && buildTags.contains("test-keys")) {
        return true
      }
    } catch (e: Exception) {
      // Ignore exceptions
    }

    return false
  }

  private fun checkDeveloperMode(): Boolean {
    return try {
      val context = appContext.reactContext ?: return false
      Settings.Global.getInt(context.contentResolver, Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) == 1
    } catch (e: Exception) {
      false
    }
  }

  private fun checkDeveloperOptions(): Boolean {
    return try {
      val context = appContext.reactContext ?: return false
      Settings.Global.getInt(context.contentResolver, Settings.Global.ADB_ENABLED, 0) == 1
    } catch (e: Exception) {
      false
    }
  }

  private fun checkEmulator(): Boolean {
    return try {
      val fingerprint = Build.FINGERPRINT
      if (fingerprint != null) {
        val emulatorKeywords = listOf(
          "generic", "unknown", "emulator", "simulator",
          "sdk", "vbox", "genymotion", "x86", "goldfish", "ranchu", "test-keys"
        )
        val lowerFingerprint = fingerprint.lowercase()
        if (emulatorKeywords.any { lowerFingerprint.contains(it) }) {
          return true
        }
      }

      val hardware = Build.HARDWARE
      if (hardware != null) {
        val emulatorHardware = listOf("goldfish", "ranchu", "vbox86")
        if (emulatorHardware.any { hardware.lowercase().contains(it) }) {
          return true
        }
      }

      val product = Build.PRODUCT
      if (product != null) {
        val emulatorProducts = listOf(
          "sdk", "google_sdk", "emulator", "simulator",
          "vbox86p", "genymotion", "generic", "generic_x86", "generic_x86_64"
        )
        if (emulatorProducts.any { product.lowercase().contains(it.lowercase()) }) {
          return true
        }
      }

      val manufacturer = Build.MANUFACTURER
      if (manufacturer != null) {
        val emulatorManufacturers = listOf("genymotion", "unknown")
        if (emulatorManufacturers.any { manufacturer.lowercase().contains(it.lowercase()) }) {
          return true
        }
      }

      val model = Build.MODEL
      if (model != null) {
        val emulatorModels = listOf(
          "sdk", "google_sdk", "emulator", "simulator", "Android SDK built for x86"
        )
        if (emulatorModels.any { model.lowercase().contains(it.lowercase()) }) {
          return true
        }
      }

      val brand = Build.BRAND
      if (brand != null && Build.DEVICE != null) {
        if (brand.lowercase().startsWith("generic") && Build.DEVICE.lowercase().startsWith("generic")) {
          return true
        }
      }

      false
    } catch (e: Exception) {
      false
    }
  }
}
