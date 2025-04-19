package studios.akdasa.lectorium.audioplayer.mediaStateNotifications;

public record MediaState(
        String trackId,
        long position,
        long duration,
        boolean isPlaying
) { }
