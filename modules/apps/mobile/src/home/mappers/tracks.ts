import { Track, PlaylistItem } from '@lectorium/dal/models'
import { useDAL } from '@lectorium/mobile/app'
// import { PlaylistItemIdentity, PlaylistItemProps, PlaylistItemState } from '../components/Playlist/PlaylistItem.vue'
import { TrackSearchResultItem } from '@lectorium/mobile/features/trackSearch'

// TODO: move to @lectorium/mobile
// TODO: DAL access should be cached

export async function mapPlaylistItem(
  playlistItem: PlaylistItem,
  language: string = 'en'
): Promise<
  any
  // & PlaylistItemIdentity 
  // & PlaylistItemProps 
  // & PlaylistItemState 
  // & { trackId: string }
> {
  const dal = useDAL()
  const track = await dal.tracks.getOne(playlistItem.trackId)
  return {
    playlistItemId: playlistItem._id,
    trackId: track._id,
    completedAt: playlistItem.completedAt,
    title: mapTrackTitle(track.title, language),
    author: await mapAuthorFullNameById(track.author, language), 
    location: await mapLocationFullNameById(track.location, language),
    tags: (track.tags || []).length >= 1
      ? await Promise.all((track.tags || []).map(tag => mapTagFullNameById(tag, language)))
      : [],
    references: track.references?.length >= 1 
      ? await Promise.all(track.references.map(ref => mapReference(ref, language)))
      : [],
    date: mapTrackDate(track.date),
  }
}

export async function mapTrackToSearchResultListItem(
  track: Track,
  language: string = 'en',
): Promise<
  TrackSearchResultItem
> {
  // Map track to search result list item
  return {
    trackId: track._id,
    title: mapTrackTitle(track.title, language),
    author: await mapAuthorFullNameById(track.author, language), 
    location: await mapLocationFullNameById(track.location, language),
    tags: (track.tags || []).length >= 1
      ? await Promise.all((track.tags || []).map(tag => mapTagFullNameById(tag, language)))
      : [],
    references: track.references?.length >= 1 
      ? await Promise.all(track.references.map(ref => mapReference(ref, language)))
      : [],
    date: mapTrackDate(track.date),
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Title                                   */
/* -------------------------------------------------------------------------- */

function mapTrackTitle(
  titles: Record<string, string>,
  language: string = 'en'
): string {
  return titles[language] 
    || titles[Object.keys(titles)[0]] 
    || 'No title'
}

/* -------------------------------------------------------------------------- */
/*                                    Date                                    */
/* -------------------------------------------------------------------------- */

function mapTrackDate(
  input: [number, number?, number?],
  locale: string = 'ru-RU'
): string {
  if (!input) { return '' }
  if (input.length === 1) {
    return input[0].toString()
  } else if (input.length === 2) {
    return new Date(
      Number(input[0]),
      Number(input[1])-1,
    ).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
    })
  } else if (input.length === 3) {
    return new Date(
      Number(input[0]),
      Number(input[1])-1,
      Number(input[2])
    ).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }
  return ''
}

/* -------------------------------------------------------------------------- */
/*                                   Author                                   */
/* -------------------------------------------------------------------------- */

async function mapAuthorFullNameById(
  authorId: string, 
  language: string = 'en'
) {
  try {
    const dal = useDAL()
    const author = await dal.authors.getOne('author::' + authorId)
    return author.fullName[language] || author.fullName['en'] || authorId
  } catch (error) {
    return authorId
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Location                                  */
/* -------------------------------------------------------------------------- */

async function mapLocationFullNameById(
  locationId: string,
  language: string = 'en'
) {
  try {
    const dal = useDAL()
    const location = await dal.locations.getOne('location::' + locationId)
    return location.fullName[language] || location.fullName['en'] || locationId
  } catch (error) {
    return locationId
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Tags                                    */
/* -------------------------------------------------------------------------- */

async function mapTagFullNameById(
  tagId: string,
  language: string = 'en'
) {
  try {
    const dal = useDAL()
    const tag = await dal.tags.getOne('tag::' + tagId)
    return tag.fullName[language] || tag.fullName['en'] || tagId
  } catch (error) {
    return tagId
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Reference                                 */
/* -------------------------------------------------------------------------- */

async function mapReference(
  reference: (string|number)[],
  language: string = 'en'
): Promise<string> {
  try {
    const dal = useDAL()
    const sourceId = 'source::' + reference[0]
    const source = await dal.sources.getOne(sourceId)
    const sourceName = source.shortName[language] || source.shortName['en'] || sourceId
    return sourceName + ' ' + reference.slice(1).join('.')
  } catch {
    return reference[0].toString().toUpperCase() + ' ' + reference.slice(1).join('.')
  }
}