package com.still.permissions

import android.Manifest
import android.accessibilityservice.AccessibilityServiceInfo
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class StillPermissionsModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("StillPermissions")

    AsyncFunction("getPermissionState") {
      mapOf(
        "usageAccessGranted" to hasUsageAccess(),
        "overlayGranted" to hasOverlayPermission(),
        "notificationsGranted" to hasNotificationPermission(),
        "accessibilityEnabled" to isStillAccessibilityServiceEnabled(),
      )
    }

    AsyncFunction("getRecentForegroundEvents") { packageNames: List<String>, sinceMs: Double ->
      getRecentForegroundEvents(packageNames.toSet(), sinceMs.toLong())
    }
  }

  private fun hasUsageAccess(): Boolean {
    val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.checkOpNoThrow(
      AppOpsManager.OPSTR_GET_USAGE_STATS,
      context.applicationInfo.uid,
      context.packageName,
    )
    return mode == AppOpsManager.MODE_ALLOWED
  }

  private fun hasOverlayPermission(): Boolean =
    Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)

  private fun hasNotificationPermission(): Boolean {
    val runtimePermissionGranted =
      Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) ==
          PackageManager.PERMISSION_GRANTED

    return runtimePermissionGranted && NotificationManagerCompat.from(context).areNotificationsEnabled()
  }

  private fun getRecentForegroundEvents(packageNames: Set<String>, requestedSinceMs: Long): List<Map<String, Any>> {
    if (!hasUsageAccess() || packageNames.isEmpty()) {
      return emptyList()
    }

    val now = System.currentTimeMillis()
    val since = requestedSinceMs.coerceIn(now - MAX_QUERY_WINDOW_MS, now)
    val usageStats = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val events = usageStats.queryEvents(since, now)
    val event = UsageEvents.Event()
    val result = mutableListOf<Map<String, Any>>()

    while (events.hasNextEvent() && result.size < MAX_RETURNED_EVENTS) {
      events.getNextEvent(event)
      val packageName = event.packageName ?: continue

      if (packageName !in packageNames) {
        continue
      }

      val type = when (event.eventType) {
        UsageEvents.Event.ACTIVITY_RESUMED -> "foreground"
        UsageEvents.Event.ACTIVITY_PAUSED,
        UsageEvents.Event.ACTIVITY_STOPPED -> "background"
        else -> null
      } ?: continue

      val normalized = mapOf(
        "packageName" to packageName,
        "timestampMs" to event.timeStamp.toDouble(),
        "type" to type,
      )

      if (result.lastOrNull() != normalized) {
        result.add(normalized)
      }
    }

    return result
  }

  private fun isStillAccessibilityServiceEnabled(): Boolean {
    val manager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    return manager
      .getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)
      .any { service -> service.resolveInfo.serviceInfo.packageName == context.packageName }
  }
}

private const val MAX_QUERY_WINDOW_MS = 24 * 60 * 60 * 1000L
private const val MAX_RETURNED_EVENTS = 1000
