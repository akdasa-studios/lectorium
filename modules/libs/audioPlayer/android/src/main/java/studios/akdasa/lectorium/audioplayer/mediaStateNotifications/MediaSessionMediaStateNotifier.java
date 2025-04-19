package studios.akdasa.lectorium.audioplayer.mediaStateNotifications;

import android.media.session.PlaybackState;

import studios.akdasa.lectorium.audioplayer.mediaSession.MediaSessionController;

public final class MediaSessionMediaStateNotifier implements IMediaStateNotifier {
    private final MediaSessionController controller;

    public MediaSessionMediaStateNotifier(MediaSessionController controller) {
        this.controller = controller;
    }

    @Override
    public void send(MediaState state) {
        if (state.trackId() != null) {
            controller.setPlaybackState(
                    state.isPlaying() ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED,
                    state.position());
        } else {
            controller.setPlaybackState(PlaybackState.STATE_STOPPED, 0);
        }
    }
}
