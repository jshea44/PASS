// React Imports
import React, { useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// Utility Imports
import { getBlobFromSolid } from '../../utils';
import ShowDocumentPreviewModal from './ShowDocumentPreviewModal';

/**
 * ShowDocumentsModal Component - Popup modal that shows client documents if gotten
 * explicit permission via ACL
 *
 * @memberof DocumentModals
 * @name ShowDocumentsModal
 */

const ShowDocumentsModal = ({ showModal, setShowModal, fileSrc }) => {
  const { session } = useSession();

  const [showDocumentBlob, setShowDocumentBlob] = useState(false);
  const [fileBlobUrl, setFileBlobUrl] = useState('');

  const handleShowDocumentLocal = async (fileUrl) => {
    const urlFileBlob = await getBlobFromSolid(session, fileUrl);
    setFileBlobUrl(urlFileBlob);
    setShowDocumentBlob(true);
  };

  return (
    <Dialog
      fullScreen
      open={showModal}
      aria-labelledby="dialog-title"
      onClose={() => setShowModal(false)}
    >
      <DialogTitle id="dialog-tile">Documents</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5
          }}
        >
          {fileSrc.map((src) => (
            <Box
              key={src.documentUrl}
              sx={{
                padding: 5,
                borderRadius: '10px',
                backgroundColor: 'lightgray',
                width: { xxs: '300px', xs: '320px' }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{src.documentType}</Typography>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: { xxs: '150px', xs: '200px', sm: '300px' },
                    textOverflow: 'ellipsis'
                  }}
                >
                  File name: {src.filename}
                </Typography>
                <Typography>Upload date: {src.uploadDate.toLocaleString()}</Typography>
                <Typography>Description: {src.description}</Typography>
                <Typography>Expire Date: {src.expireDate}</Typography>
                <br />
                <Typography sx={{ fontWeight: 'bold' }}>Show Document</Typography>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => handleShowDocumentLocal(src.documentUrl)}
                >
                  Preview
                </Button>
                <Button variant="contained" type="button">
                  <Link
                    href={src.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: 'white',
                      textDecoration: 'none'
                    }}
                  >
                    New Window
                  </Link>
                </Button>
              </Box>
            </Box>
          ))}
          {showDocumentBlob && (
            <ShowDocumentPreviewModal
              showModal={showDocumentBlob}
              setShowModal={setShowDocumentBlob}
              fileBlobUrl={fileBlobUrl}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          endIcon={<ClearIcon />}
          onClick={() => setShowModal(false)}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDocumentsModal;
