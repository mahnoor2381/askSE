// ✏️ EDIT THIS BLOCK with your team details (shown on the About screen).
export const TEAM = {
  entryId: "YOUR-ENTRY-ID",
  teamName: "Your Team Name",
  members: ["Member One", "Member Two"],
  repoUrl: "https://github.com/YOUR-USER/vibejam-YOUR-ENTRY-ID",
  aiTools: ["Claude (code generation and debugging)"],
};

export const ADMIN_PIN = "2026";
export const CATEGORIES = ["Labs", "Academics", "Library", "Exams", "Fees", "Projects", "Transport", "Help"];

export const LIMITS = { msgMax: 300, qMin: 10, qMax: 150, aMin: 10, aMax: 400 };

// Messages that must appear word for word.
export const MSG = {
  notice: "Answers are AI-generated from the department FAQ. Verify important information with the office.",
  badLength: "Message must be 1 to 300 characters.",
  notFound: "Sorry, I could not find this in the department FAQ. Please email helpdesk@se.example.edu or visit Room 210.",
  aiFailure: "AI service unavailable. Check your connection or API key and try again.",
  wrongPin: "Incorrect PIN",
  clearConfirm: "Clear all messages?",
};

export const SUGGESTIONS = [
  "When is the library open?",
  "Attendance requirement kya hai?",
  "When do the buses leave?",
  "Midterm miss ho gaya, ab kya karun?",
];
