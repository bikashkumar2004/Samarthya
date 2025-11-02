import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  UserPlus, 
  Users, 
  CheckCircle2,
  FileUp,
  X,
  FileText,
  UserX
} from 'lucide-react';

const Assign = () => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [autoDistribute, setAutoDistribute] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedLeads, setParsedLeads] = useState([]);
  const fileInputRef = useRef(null);

  // Sample agents data
  const agentsData = [
    { id: 1, name: 'John Doe', workload: 'Low' },
    { id: 2, name: 'Sarah Smith', workload: 'Medium' },
    { id: 3, name: 'Mike Johnson', workload: 'High' },
    { id: 4, name: 'Emily Davis', workload: 'Low' },
    { id: 5, name: 'David Wilson', workload: 'Medium' },
  ];

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const leads = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        const lead = {
          id: i,
          name: values[0] || 'Unknown',
          phone: values[1] || 'N/A',
          email: values[2] || '',
          status: values[3] || 'New',
          company: values[4] || '',
          city: values[5] || ''
        };
        leads.push(lead);
      }
    }
    return leads;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const leads = parseCSV(text);
        setParsedLeads(leads);
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setParsedLeads([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRejectLead = (leadId) => {
    setParsedLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const handleAssign = () => {
    if (!uploadedFile) {
      alert('Please upload a file first');
      return;
    }
    if (parsedLeads.length === 0) {
      alert('No leads available to assign');
      return;
    }
    if (!selectedAgent && !autoDistribute) {
      alert('Please select an agent or enable auto-distribute');
      return;
    }
    alert(`Assigned ${parsedLeads.length} leads successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Assign New Task
          </h1>
          <p className="text-gray-600">Assign leads to agents efficiently</p>
        </div>

        {/* Horizontal Line */}
        <div className="border-t-2 border-gray-300 mb-8"></div>

        {/* Bulk Task Assignment Section */}
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileUp className="w-6 h-6 text-blue-600" />
              Bulk Task Assignment
            </h2>
            <p className="text-sm text-gray-600 mt-1">Import leads from CSV or Excel file</p>
          </div>
        </div>

        {/* Step 1: Select Leads to Assign with Import Button */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  1
                </div>
                Select Leads to Assign
                {parsedLeads.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    {parsedLeads.length} leads selected
                  </span>
                )}
              </CardTitle>
              
              {/* Import File Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={handleImportClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import File
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Show uploaded file if exists */}
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">File Uploaded Successfully</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {parsedLeads.length} leads found. Click reject to remove unwanted leads.
                    </p>
                  </div>
                </div>

                {/* Display Parsed Leads */}
                {parsedLeads.length > 0 && (
                  <div className="space-y-3">
                    {parsedLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 bg-white hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800">{lead.name}</p>
                              <p className="text-sm text-gray-600">{lead.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                lead.status === 'New' ? 'bg-green-100 text-green-700' :
                                lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {lead.status}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectLead(lead.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {parsedLeads.length === 0 && uploadedFile && (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">All leads have been rejected</p>
                    <p className="text-sm text-gray-500">
                      Upload a new file to continue
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">No file uploaded yet</p>
                <p className="text-sm text-gray-500">
                  Click the "Import File" button above to upload a CSV or Excel file
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Choose Agent */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-bold text-sm">
                2
              </div>
              Choose Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Agent Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Select Agent
                </label>
                <Select 
                  value={selectedAgent} 
                  onValueChange={setSelectedAgent}
                  disabled={autoDistribute}
                >
                  <SelectTrigger className={`w-full ${autoDistribute ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentsData.map((agent) => (
                      <SelectItem key={agent.id} value={agent.name}>
                        <div className="flex items-center justify-between gap-3">
                          <span>{agent.name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            agent.workload === 'Low' ? 'bg-green-100 text-green-700' :
                            agent.workload === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {agent.workload}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Distribute Checkbox */}
              <div className="flex items-end">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 w-full">
                  <Checkbox 
                    id="auto-distribute"
                    checked={autoDistribute}
                    onCheckedChange={setAutoDistribute}
                    className="border-2"
                  />
                  <div>
                    <label 
                      htmlFor="auto-distribute" 
                      className="text-sm font-semibold text-gray-800 cursor-pointer block"
                    >
                      Auto Distribute
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Distribute leads evenly across all agents
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Message */}
            {autoDistribute && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Auto Distribution Enabled</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Selected leads will be automatically distributed among available agents based on their current workload.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assign Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleAssign}
            disabled={!uploadedFile || parsedLeads.length === 0}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 px-8 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Assign Tasks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assign;
