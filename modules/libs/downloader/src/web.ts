import { WebPlugin } from '@capacitor/core';

import type { DownloaderPlugin, DownloadRequest, DownloadResponse, GetStatusRequest, GetStatusResponse } from './definitions';

export class DownloaderWeb extends WebPlugin implements DownloaderPlugin {
  async enqueue(request: DownloadRequest): Promise<DownloadResponse> {
    console.log('Downloading: ', request.url);
    return { taskId: Math.random().toString(36).substring(2, 15) };
  }

  async getStatus(request: GetStatusRequest): Promise<GetStatusResponse> {
    console.log('Getting status for taskId: ', request.taskId);
    return { status: 'successful' };
  }
}
