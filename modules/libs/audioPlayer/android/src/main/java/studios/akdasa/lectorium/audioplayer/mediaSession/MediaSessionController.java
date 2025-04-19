package studios.akdasa.lectorium.audioplayer.mediaSession;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.core.app.NotificationCompat;
import androidx.media.session.MediaButtonReceiver;

public final class MediaSessionController {
    private final MediaSessionCompat mediaSession;
    private final Context context;
    private final NotificationManager notificationManager;

    public MediaSessionController(
            Context context,
            NotificationManager notificationManager,
            MediaSessionCompat.Callback mediaSessionCallback
    ) {
        this.context = context;
        this.notificationManager = notificationManager;

        this.mediaSession = new MediaSessionCompat(context, "MediaSessionPlugin");
        mediaSession.setMediaButtonReceiver(PendingIntent.getBroadcast(
                context,
                0,
                new Intent(Intent.ACTION_MEDIA_BUTTON),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        ));
        this.mediaSession.setCallback(mediaSessionCallback);
        this.mediaSession.setActive(true);
    }

    public void setMediaInfo(
            String title,
            String artist,
            long duration
    ) {
        mediaSession.setMetadata(new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
                .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration)
                .build());
        updateNotification();
    }

    public void setPlaybackState(
            int playbackState,
            long position
    ) {
        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(playbackState, position, 1.0f)
                .setActions(
                        PlaybackStateCompat.ACTION_PLAY |
                        PlaybackStateCompat.ACTION_PAUSE)
                .build());
        updateNotification();
    }

    private void updateNotification() {
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(
                context, "MediaPlaybackChannel");
        MediaMetadataCompat metadata = mediaSession.getController().getMetadata();
        PlaybackStateCompat playbackState = mediaSession.getController().getPlaybackState();
        int appIconResId = context.getApplicationInfo().icon;
        if (metadata == null || playbackState == null) { return; }

        notificationBuilder
                // .setDeleteIntent(MediaButtonReceiver.buildMediaButtonPendingIntent(service.context, PlaybackStateCompat.ACTION_STOP))
                .setContentTitle(metadata.getString(MediaMetadataCompat.METADATA_KEY_TITLE))
                .setContentText(metadata.getString(MediaMetadataCompat.METADATA_KEY_ARTIST))
                .setSubText(metadata.getString(MediaMetadataCompat.METADATA_KEY_ALBUM))
                .setSmallIcon(appIconResId)
                .setContentIntent(mediaSession.getController().getSessionActivity())
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setAutoCancel(false)
                .addAction(new NotificationCompat.Action(
                        playbackState.getState() == PlaybackStateCompat.STATE_PLAYING ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play,
                        playbackState.getState() == PlaybackStateCompat.STATE_PLAYING ? "Pause" : "Play",
                        MediaButtonReceiver.buildMediaButtonPendingIntent(context, PlaybackStateCompat.ACTION_PLAY_PAUSE)))
                .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                        .setMediaSession(mediaSession.getSessionToken())
                        .setShowActionsInCompactView(0));

        Notification notification = notificationBuilder.build();
        notificationManager.notify(1, notification);
    }
}
