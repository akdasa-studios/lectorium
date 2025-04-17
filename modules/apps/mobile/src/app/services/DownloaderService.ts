import { 
  Downloader, DownloadRequest, DownloadResponse, GetStatusRequest, 
  GetStatusResponse 
} from 'lectorium-downloader'

export type DownloaderTaskStatuses = GetStatusResponse['status']

export class DownloaderService {
  async enqueue(request: DownloadRequest): Promise<DownloadResponse> {
    return await Downloader.enqueue(request)
  }

  async getStatus(request: GetStatusRequest): Promise<GetStatusResponse> {
    return await Downloader.getStatus(request)
  }
}
