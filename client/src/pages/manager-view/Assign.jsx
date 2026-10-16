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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Batch Lead Assignment
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
            Allocation Engine
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1">Import clinical or prospect lead sheets and distribute directly to active agent queues</p>
      </div>

      {/* Step 1: Select Leads to Assign with Import Button */}
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-xs">
                1
              </div>
              Import Lead Roster (.CSV / .XLSX)
              {parsedLeads.length > 0 && (
                <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                  {parsedLeads.length} leads loaded
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload CSV File
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {/* Show uploaded file if exists */}
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{uploadedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedLeads.length} valid rows
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Display Parsed Leads */}
              {parsedLeads.length > 0 && (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {parsedLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{lead.name}</p>
                          <p className="text-[11px] text-slate-400">{lead.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          {lead.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectLead(lead.id)}
                          className="h-7 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                        >
                          <UserX className="w-3.5 h-3.5 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div 
              onClick={handleImportClick}
              className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 cursor-pointer hover:border-indigo-400 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Click to select CSV lead manifest</p>
              <p className="text-[11px] text-slate-400">
                Supports standard comma-separated columns: Name, Phone, Email, Status, City
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Choose Agent */}
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-xs">
              2
            </div>
            Designate Agent or Enable Workload Auto-Balancing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select Agent Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Dedicated Agent
              </label>
              <Select 
                value={selectedAgent} 
                onValueChange={setSelectedAgent}
                disabled={autoDistribute}
              >
                <SelectTrigger className={`w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs ${autoDistribute ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  {agentsData.map((agent) => (
                    <SelectItem key={agent.id} value={agent.name}>
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span>{agent.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          agent.workload === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                          agent.workload === 'Medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {agent.workload} Load
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto Distribute Checkbox */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-indigo-200/70 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20">
              <Checkbox 
                id="auto-distribute"
                checked={autoDistribute}
                onCheckedChange={setAutoDistribute}
                className="rounded border-indigo-300 data-[state=checked]:bg-indigo-600"
              />
              <div>
                <label 
                  htmlFor="auto-distribute" 
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer block"
                >
                  Smart Auto-Distribute
                </label>
                <p className="text-[11px] text-slate-500">
                  Round-robin distribute evenly based on agent queue capacity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assign Button */}
      <div className="flex justify-end pt-2">
        <Button 
          onClick={handleAssign}
          disabled={!uploadedFile || parsedLeads.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-7 py-3 text-sm font-semibold shadow-xs disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Dispatch {parsedLeads.length > 0 ? `${parsedLeads.length} Tasks` : 'Tasks'}
        </Button>
      </div>
    </div>
  );
};

export default Assign;
