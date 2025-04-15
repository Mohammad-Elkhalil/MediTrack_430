import React, { useState, useEffect } from 'react';
import { healthRecordService, HealthRecord } from '@/services/healthRecordService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useEncryption } from '@/contexts/EncryptionContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ViewHealthRecordProps {
  patientId: string;
  recordId: string;
  onEdit?: () => void;
}

const ViewHealthRecord: React.FC<ViewHealthRecordProps> = ({
  patientId,
  recordId,
  onEdit
}) => {
  const { decryptData } = useEncryption();
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchRecord();
  }, [patientId, recordId]);

  const fetchRecord = async () => {
    try {
      setIsLoading(true);
      const records = await healthRecordService.getPatientRecords(patientId);
      const currentRecord = records.find(r => r.id === recordId);
      if (currentRecord) {
        setRecord(currentRecord);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Health record not found",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch health record",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await healthRecordService.deleteHealthRecord(recordId);
      toast({
        title: "Success",
        description: "Health record deleted successfully",
      });
      setShowDeleteDialog(false);
      // Redirect or refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete health record",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Health record not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Record Details</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onEdit}>
            Edit Record
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{record.diagnosis}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{record.treatment}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {record.medications.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {record.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{record.notes}</p>
          </CardContent>
        </Card>
      )}

      {record.attachments && record.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Attachment {index + 1}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => healthRecordService.deleteAttachment(recordId, attachment)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this health record? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewHealthRecord; 