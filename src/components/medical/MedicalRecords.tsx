import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFileUpload, FaDownload, FaEye, FaLock } from 'react-icons/fa';

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: string;
  doctor: string;
  fileUrl: string;
  isEncrypted: boolean;
}

// Mock data for medical records
const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    title: 'Blood Test Results',
    date: '2024-03-10',
    type: 'Laboratory',
    doctor: 'Dr. John Smith',
    fileUrl: '/mock-files/blood-test.pdf',
    isEncrypted: true,
  },
  {
    id: '2',
    title: 'X-Ray Report',
    date: '2024-03-05',
    type: 'Radiology',
    doctor: 'Dr. Sarah Johnson',
    fileUrl: '/mock-files/xray.pdf',
    isEncrypted: true,
  },
];

const MedicalRecords: React.FC = () => {
  const [records] = useState<MedicalRecord[]>(mockRecords);
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
      // TODO: Implement actual file upload with encryption
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const handleDownload = async (record: MedicalRecord) => {
    try {
      setLoading(true);
      // TODO: Implement actual file download with decryption
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('File downloaded and decrypted successfully');
    } catch (error) {
      toast.error('Failed to download file. Please try again.');
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: MedicalRecord) => {
    try {
      setLoading(true);
      // TODO: Implement secure file viewing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would open a secure viewer
      toast.info('Opening secure document viewer...');
    } catch (error) {
      toast.error('Failed to view file. Please try again.');
      console.error('View error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h2>

      {/* Upload Section */}
      <form onSubmit={handleUploadSubmit} className="mb-8">
        <div className="max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Record
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
          </div>
          {selectedFile && (
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Selected File'}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Records List */}
      <div className="space-y-4">
        {records.map(record => (
          <div
            key={record.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <FaLock className="text-green-500 mr-2" />
                <h3 className="font-medium text-gray-900">{record.title}</h3>
              </div>
              <div className="text-sm text-gray-500">
                <p>Date: {record.date}</p>
                <p>Type: {record.type}</p>
                <p>Doctor: {record.doctor}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(record)}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaEye className="mr-2" />
                View
              </button>
              <button
                onClick={() => handleDownload(record)}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaDownload className="mr-2" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords; 