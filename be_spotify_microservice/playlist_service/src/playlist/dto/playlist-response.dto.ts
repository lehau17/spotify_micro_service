import { playlists } from '@prisma/client';
import { SongDto } from './create-playlist.dto';

export type PlaylistResponse = Omit<playlists, 'songs'> & { songs: SongDto[] };
