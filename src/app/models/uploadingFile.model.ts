export class UploadingFile {
    constructor(public data: any) {
        this.data = data;
        this.inProgress = false;
        this.progress = 0;
        this.uploaded = false;
        this.uploadFailed = false;
        this.cvId = "";
    }
    inProgress: boolean;
    progress: number;
    uploaded: boolean;
    uploadFailed: boolean;
    cvId: string;
}