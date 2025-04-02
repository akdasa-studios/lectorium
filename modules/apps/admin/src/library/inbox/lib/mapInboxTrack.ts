import type { InboxTrack } from "@brahma/dal/models";
import type { EditInboxTrack } from "@brahma/library/inbox";

export function mapEditInboxTrackToInboxTrack(
  editInboxTrack: EditInboxTrack,
  inboxTrack: InboxTrack,
): InboxTrack {
  inboxTrack.title.normalized       = editInboxTrack.title
  inboxTrack.author.normalized      = editInboxTrack.author
  inboxTrack.location.normalized    = editInboxTrack.location
  inboxTrack.date.normalized        = editInboxTrack.date
  inboxTrack.references.normalized  = editInboxTrack.references.map(x => x.split(/\s|\./))
  inboxTrack.languagesExtract       = editInboxTrack.languagesExtract
  inboxTrack.languagesTranslateInto = editInboxTrack.languagesTranslateInto
  inboxTrack.status                 = editInboxTrack.status
  return inboxTrack
}