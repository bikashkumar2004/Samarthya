export const registationFormControl = [
  {
    name: "userName",
    label: "username",
    placeholder: "Fill name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Fill your mail",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "password",
    placeholder: "Fill password",
    componentType: "input",
    type: "password",
  },
];
export const loginFromControls = [
  {
    name: "email",
    label: "email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addContactFormElements = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter full name",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    componentType: "input",
    type: "email",
    placeholder: "Enter email address",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter phone number",
  },
  {
    label: "WhatsApp Number",
    name: "whatsappNo",
    componentType: "input",
    type: "text",
    placeholder: "Enter WhatsApp number",
  },
  {
    name: "status",
    componentType: "select",
    options: [
      { id: "New", label: "New" },
      { id: "Pending", label: "Pending" },
      { id: "Rejected", label: "Rejected" },
      { id: "Assigned", label: "Assigned" },
      { id: "Imported", label: "Imported" },
      { id: "Contacted", label: "Contacted" },
      { id: "Interested", label: "Interested" },
      { id: "No Replay", label: "No Replay" },
      { id: "Engaging", label: "Engaging" },
    ],
    required: true,
    placeholder: "Select status",
  },
  {
    label: "Purpose", 
    name: "purpose",
    componentType: "textarea",
    placeholder: "Enter the purpose or notes about this contact",
    required: true,
    rows: 4,
  },
];
