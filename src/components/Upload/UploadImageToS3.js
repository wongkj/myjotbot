import React ,{useState} from 'react';
import AWS from 'aws-sdk'
import {
    Typography,
    Button,
    makeStyles
} from '@material-ui/core'
import { GiConsoleController } from 'react-icons/gi';

const S3_BUCKET ='myjotbot-uploads/audioFile';
const REGION ='us-east-1';

const useStyles = makeStyles({
  uploadContainer: {
      marginTop: "4em",
  },
  uploadFileBtn: {
    marginRight: '2em'
  }, 
  uploadToS3Btn: {
    marginTop: '2em'
  }
})

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const UploadImageToS3 = () => {

    const classes = useStyles()

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
        // console.log(e.target.files[0])
    }

    const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }


    return <div className={classes.uploadContainer}>
        <Typography
          gutterBottom
          variant="h3"
          component="h3"
        >
            Upload Audio for Transcription
        </Typography>      
        <Typography
          gutterBottom
          variant="h5"
          component="h5"
        >
            File Upload Progress is {progress}%
        </Typography>
        <br/>
        <Button
          variant="contained"
          component="label"
          color="primary"
          size="large"
          className={classes.uploadFileBtn}
        >
          Upload File
          <input
            type="file"
            onChange={handleFileInput}
            hidden
          />
        </Button>
          {
            selectedFile ? selectedFile.name : 'No file selected'
          }
        <br/>
        <Button
          variant="contained"
          color="primary"
          size="large"        
          onClick={() => uploadFile(selectedFile)}
          className={classes.uploadToS3Btn}
        > 
          Upload to S3
        </Button>
    </div>
}

export default UploadImageToS3;
