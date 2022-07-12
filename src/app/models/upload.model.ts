export class UploadingFile {
    constructor(data: any) {
        this.data = data;
        this.inProgress = false;
        this.progress = 0;
        this.uploaded = false;
        this.uploadFailed = false;
        this.cvId = "";
    }
    data: any;
    inProgress: boolean;
    progress: number;
    uploaded: boolean;
    uploadFailed: boolean;
    cvId: string;
}
export class numberResult {
    constructor(
        //public id:string = undefined,
        //Identifier
        public worked:boolean = false,
        public number:string | undefined = undefined
        )
        {
            this.worked = worked
            this.number = number
        }

}
export class idResult {
    constructor(
        //public id:string = undefined,
        //Identifier
        public worked:boolean = false,
        public id:string | undefined = undefined,
        public id_prefix:string | undefined = undefined,
        public id_suffix:string | undefined = undefined,

        )
        {
            this.worked = worked
            this.id = id
            this.id_prefix = id_prefix
            this.id_suffix = id_suffix
        }

}
