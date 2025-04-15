import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFileUpload, FaDownload, FaEye, FaLock } from 'react-icons/fa';
import { MedicalRecord, MedicalRecordType, MedicalRecordError, MedicalRecordState } from '@/types/medical';
import { withEncryption } from '../security/withEncryption';

interface RecordStates {
  [key: string]: MedicalRecordState;
}

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordStates, setRecordStates] = useState<RecordStates>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPEG, or PNG files only.');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      await handleUpload(selectedFile, 'Laboratory');
      toast.success('File uploaded and encrypted successfully');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error('Failed to upload file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, type: MedicalRecordType) => {
    const recordId = crypto.randomUUID();
    setRecordStates(prev => ({
      ...prev,
      [recordId]: { isUploading: true, isDownloading: false, isViewing: false, error: null }
    }));

    try {
      // Upload logic here
      const newRecord: MedicalRecord = {
        id: recordId,
        title: file.name,
        date: new Date().toISOString(),
        type,
        doctor: 'Dr. Smith', // Replace with actual logged in doctor
        fileUrl: 'mock-url', // Replace with actual uploaded file URL
        isEncrypted: true
      };

      setRecords(prev => [...prev, newRecord]);
    } catch (error) {
      const medicalError: MedicalRecordError = {
        name: 'UploadError',
        message: 'Failed to upload medical record',
        code: 'UPLOAD_FAILED',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
      setRecordStates(prev => ({
        ...prev,
        [recordId]: { ...prev[recordId], error: medicalError, isUploading: false }
      }));
    }
  };

  const handleDownload = async (record: MedicalRecord) => {
    setRecordStates(prev => ({
      ...prev,
      [record.id]: { ...prev[record.id], isDownloading: true, error: null }
    }));

    try {
      // Download logic here
    } catch (error) {
      const medicalError: MedicalRecordError = {
        name: 'DownloadError',
        message: 'Failed to download medical record',
        code: 'DOWNLOAD_FAILED',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
      setRecordStates(prev => ({
        ...prev,
        [record.id]: { ...prev[record.id], error: medicalError, isDownloading: false }
      }));
    }
  };

  const handleView = async (record: MedicalRecord) => {
    setRecordStates(prev => ({
      ...prev,
      [record.id]: { ...prev[record.id], isViewing: true, error: null }
    }));

    try {
      // View logic here
    } catch (error) {
      const medicalError: MedicalRecordError = {
        name: 'ViewError',
        message: 'Failed to view medical record',
        code: 'VIEW_FAILED',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
      setRecordStates(prev => ({
        ...prev,
        [record.id]: { ...prev[record.id], error: medicalError, isViewing: false }
      }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Medical Records</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          <FaFileUpload className="mr-2" />
          Select File
        </label>
        {selectedFile && (
          <div className="mt-2">
            <span className="text-gray-600">{selectedFile.name}</span>
            <button
              onClick={handleUploadSubmit}
              disabled={loading}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {records.map((record) => {
          const state = recordStates[record.id] || {
            isUploading: false,
            isDownloading: false,
            isViewing: false,
            error: null
          };

          return (
            <div
              key={record.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    {record.title}
                    {record.isEncrypted && (
                      <FaLock className="ml-2 text-green-500" title="Encrypted" />
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">{record.doctor}</p>
                  <p className="text-gray-600 text-sm">Type: {record.type}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(record)}
                    disabled={state.isDownloading}
                    className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => handleView(record)}
                    disabled={state.isViewing}
                    className="p-2 text-green-500 hover:text-green-600 disabled:text-gray-400"
                    title="View"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>

              {/* Error Messages */}
              {state.error && (
                <div className="mt-2 text-red-500 text-sm">
                  {state.error.message}
                  {state.error.details && (
                    <span className="block text-xs text-red-400">
                      {state.error.details}
                    </span>
                  )}
                </div>
              )}

              {/* Loading States */}
              {(state.isUploading || state.isDownloading || state.isViewing) && (
                <div className="mt-2 text-sm text-blue-500">
                  {state.isUploading && 'Uploading...'}
                  {state.isDownloading && 'Downloading...'}
                  {state.isViewing && 'Opening viewer...'}
                </div>
              )}
            </div>
          );
        })}

        {records.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No medical records found. Upload a new record to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default withEncryption(MedicalRecords); 