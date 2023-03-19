declare namespace Express {
  declare namespace Multer {
    export interface File {
      key: string;
      location: string;
    }
  }

  export interface Request {
    user: {
      id: number;
      name: string;
      email: string;
    };

    file: Multer.File;
  }
}
