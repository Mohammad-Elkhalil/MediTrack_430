import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useEncryption } from '@/hooks/use-encryption';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, FileText, Trash2 } from 'lucide-react';

interface HealthRecord {
  id: string;
  patientId: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
  attachments: string[];
  updatedAt: string;
}

export const UpdateHealthRecord: React.FC<{ patientId: string; recordId?: string }> = ({
  patientId,
  recordId,
}) => {
  const { user } = useAuth();
  const { encrypt } = useEncryption();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/health-records/${recordId}`);
      if (!response.ok) throw new Error('Failed to fetch record');
      const data = await response.json();
      setRecord(data);
      setMedications(data.medications || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load health record",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications(prev => [...prev, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const diagnosis = (document.getElementById('diagnosis') as HTMLTextAreaElement)?.value;
    const treatment = (document.getElementById('treatment') as HTMLTextAreaElement)?.value;

    if (!diagnosis?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a diagnosis",
      });
      return false;
    }

    if (!treatment?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a treatment plan",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Encrypt sensitive data
      const diagnosis = encrypt((document.getElementById('diagnosis') as HTMLTextAreaElement).value);
      const treatment = encrypt((document.getElementById('treatment') as HTMLTextAreaElement).value);
      const notes = encrypt((document.getElementById('notes') as HTMLTextAreaElement).value);

      formData.append('diagnosis', diagnosis);
      formData.append('treatment', treatment);
      formData.append('medications', JSON.stringify(medications));
      formData.append('notes', notes);
      formData.append('patientId', patientId);
      formData.append('doctorId', user?.id || '');

      files.forEach(file => {
        formData.append('attachments', file);
      });

      const url = recordId 
        ? `/api/health-records/${recordId}`
        : '/api/health-records';

      const response = await fetch(url, {
        method: recordId ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update record');

      toast({
        title: "Success",
        description: `Health record ${recordId ? 'updated' : 'created'} successfully`,
      });

      // Reset form
      setFiles([]);
      setMedications([]);
      setShowConfirmDialog(false);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update health record",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {recordId ? 'Update Health Record' : 'Create Health Record'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Textarea
            id="diagnosis"
            placeholder="Enter detailed diagnosis"
            defaultValue={record?.diagnosis}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment">Treatment Plan</Label>
          <Textarea
            id="treatment"
            placeholder="Enter treatment plan"
            defaultValue={record?.treatment}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Medications</Label>
          <div className="flex gap-2">
            <Input
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              placeholder="Add medication"
            />
            <Button type="button" onClick={addMedication}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2">
            {medications.map((med, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="bg-gray-100 p-2 rounded flex-1">{med}</div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any additional notes"
            defaultValue={record?.notes}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments">Attachments</Label>
          <div className="flex items-center gap-2">
            <Input
              id="attachments"
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
          <div className="mt-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="flex-1">{file.name}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {recordId ? 'Update Record' : 'Create Record'}
        </Button>
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to {recordId ? 'update' : 'create'} this health record?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 