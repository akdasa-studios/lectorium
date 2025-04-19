package studios.akdasa.lectorium.audioplayer.mediaStateNotifications;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public final class PluginCallMediaStateNotifier implements IMediaStateNotifier {
    private final PluginCall call;

    public PluginCallMediaStateNotifier(PluginCall call) {
        this.call = call;
    }

    @Override
    public void send(MediaState state) {
        JSObject payload = new JSObject();
        if (state.trackId() != null) {
            payload.put("position", state.position() / 1000);
            payload.put("duration", state.duration() / 1000);
            payload.put("playing", state.isPlaying());
            payload.put("trackId", state.trackId());
        } else {
            payload.put("position", 0);
            payload.put("duration", 0);
            payload.put("playing", false);
            payload.put("trackId", null);
        }
        call.resolve(payload);
    }
}
