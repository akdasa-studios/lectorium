package studios.akdasa.lectorium.audioplayer.mediaStateNotifications;

import android.media.MediaPlayer;
import android.os.Handler;

import java.util.ArrayList;
import java.util.List;


public final class MediaStateNotificationService {
    private final List<IMediaStateNotifier> notifiers = new ArrayList<>();
    private final MediaPlayer mediaPlayer;
    private boolean isRunning = true;

    private final Handler handler = new Handler();
    private final Runnable runnable = new Runnable() {
        @Override
        public void run() {
            if (!isRunning) { return; }
            update();
            handler.postDelayed(this, 1000);
        }
    };
    private String currentTrackId;

    public MediaStateNotificationService(
            MediaPlayer mediaPlayer
    ) {
        this.mediaPlayer = mediaPlayer;
    }

    public void run() {
        isRunning = true;
        this.runnable.run();
    }

    public void update() {
        for (IMediaStateNotifier notifier : notifiers) {
            notifier.send(
                    new MediaState(
                            currentTrackId,
                            mediaPlayer.isPlaying() ? mediaPlayer.getCurrentPosition() : 0,
                            mediaPlayer.isPlaying() ? mediaPlayer.getDuration() : 0,
                            mediaPlayer.isPlaying()));
        }
    }

    public void setCurrentTrackId(String value) {
        currentTrackId = value;
    }

    public void addNotifier(IMediaStateNotifier notifier) {
        notifiers.add(notifier);
    }

    public void stop() {
        isRunning = false;
    }
}
