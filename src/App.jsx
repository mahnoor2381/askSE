import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  MessageCircle,
  Database,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Clock,
  BookOpen,
  GraduationCap,
  Bus,
  FlaskConical,
  FileText,
  Sparkles,
  ArrowUpRight,
  Plus,
  Menu,
  X
} from 'lucide-react'

import './App.css'

import { initialFAQs } from './data/faqs'

const categories = [
  { name: 'Laboratories', count: 1, icon: FlaskConical, color: 'purple' },
  { name: 'Academics', count: 1, icon: GraduationCap, color: 'blue' },
  { name: 'Library', count: 1, icon: BookOpen, color: 'cyan' },
  { name: 'Examinations', count: 1, icon: FileText, color: 'pink' },
  { name: 'Transport', count: 1, icon: Bus, color: 'orange' },
  { name: 'Projects', count: 1, icon: Database, color: 'green' }
]

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'AI Assistant', icon: MessageCircle },
  { name: 'Knowledge Base', icon: Database },
  { name: 'Admin Panel', icon: ShieldCheck },
  { name: 'About AskSE', icon: BookOpen }
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [faqs, setFaqs] = useState(() => {
    const savedFAQs = localStorage.getItem('askse-faqs')
    return savedFAQs ? JSON.parse(savedFAQs) : initialFAQs
  })
  const [messages, setMessages] = useState(() => {
  const savedMessages = localStorage.getItem('askse-chat')

  return savedMessages
    ? JSON.parse(savedMessages)
    : [
        {
          role: 'assistant',
          content: 'Hello! I am AskSE, your university help desk assistant. How can I help you today?'
        }
      ]
})

const [chatInput, setChatInput] = useState('')
const [adminUnlocked, setAdminUnlocked] = useState(false)
const [adminPin, setAdminPin] = useState('')
const [newCategory, setNewCategory] = useState('')
const [newQuestion, setNewQuestion] = useState('')
const [newAnswer, setNewAnswer] = useState('')

useEffect(() => {
  localStorage.setItem('askse-chat', JSON.stringify(messages))
}, [messages])

useEffect(() => {
  localStorage.setItem('askse-faqs', JSON.stringify(faqs))
}, [faqs])

  const filteredFAQs = faqs.filter(faq =>
  faq.question.toLowerCase().includes(search.toLowerCase()) ||
  faq.category.toLowerCase().includes(search.toLowerCase()) ||
  faq.id.toLowerCase().includes(search.toLowerCase())
)

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSendMessage = () => {
  const question = chatInput.trim()

  if (!question) return

  const userMessage = {
  role: 'user',
  content: question,
  time: new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

  const normalizedQuestion = question.toLowerCase()

  const romanUrduKeywords = {
  'FAQ-01': ['lab ka time', 'lab kab khulti', 'computer lab ka time'],
  'FAQ-02': ['attendance kitni', 'attendance kitni honi chahiye', 'hazri'],
  'FAQ-03': ['library ka time', 'library kab khulti', 'library kab band'],
  'FAQ-04': ['retake kaise', 'exam dobara', 'retake apply'],
  'FAQ-05': ['fees ki last date', 'fee jama', 'fees deadline'],
  'FAQ-06': ['fyp ki deadline', 'project kab submit', 'fyp proposal'],
  'FAQ-07': ['bus ka time', 'bus kab jati', 'university bus timing'],
  'FAQ-08': ['help desk kahan', 'department se rabta', 'email kya hai']
}

const romanUrduAnswers = {
  'FAQ-01': 'Computer lab CS-LAB-102A Monday se Friday, subah 08:00 AM se shaam 06:00 PM tak khuli hoti hai.',
  'FAQ-02': 'Har course mein students ke liye kam az kam 80% attendance zaroori hai.',
  'FAQ-03': 'Library Monday se Thursday 08:30 AM se 08:00 PM tak aur Friday 08:30 AM se 12:30 PM tak khuli hoti hai. Weekend par band hoti hai.',
  'FAQ-04': 'Retake ke liye 3 working days ke andar apply karna aur medical certificate dena zaroori hai.',
  'FAQ-05': 'Spring 2027 ki fees 15 January 2027 tak submit karni hai, warna fine lag sakta hai.',
  'FAQ-06': 'FYP proposal 30 November 2026 tak SLATE par submit karna hai. Group mein 2 ya 3 members hone chahiye.',
  'FAQ-07': 'University buses Monday se Friday 01:30 PM aur 04:30 PM par chalti hain.',
  'FAQ-08': 'Aap helpdesk@se.example.edu par email kar sakte hain ya 09:00 AM se 04:00 PM ke darmiyan Room 210 visit kar sakte hain.'
}

  const keywords = {
    'FAQ-01': ['lab', 'laboratory', 'computer lab', 'lab timings'],
    'FAQ-02': ['attendance', 'attend', 'percentage', '80%'],
    'FAQ-03': ['library', 'books', 'library hours'],
    'FAQ-04': ['retake', 'exam retake', 'medical certificate'],
    'FAQ-05': ['fee', 'fees', 'fee deadline', 'payment'],
    'FAQ-06': ['fyp', 'final year project', 'proposal', 'project deadline'],
    'FAQ-07': ['bus', 'transport', 'university bus'],
    'FAQ-08': ['help desk', 'helpdesk', 'contact', 'email', 'room 210']
  }

  let bestMatch = null
  let highestScore = 0

  faqs.forEach(faq => {
    const matches = [
  ...(keywords[faq.id] || []),
  ...(romanUrduKeywords[faq.id] || [])
]

    const keywordScore = matches.reduce((total, keyword) => {
      return total + (normalizedQuestion.includes(keyword) ? 1 : 0)
    }, 0)

    const faqTerms = `${faq.question} ${faq.category}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length >= 4)

    const questionTerms = normalizedQuestion
      .split(/[^a-z0-9]+/)
      .filter(word => word.length >= 4)

    const customFaqScore = questionTerms.reduce((total, word) => {
      return total + (faqTerms.includes(word) ? 1 : 0)
    }, 0)

    const score = keywordScore + customFaqScore

    if (score > highestScore) {
      highestScore = score
      bestMatch = faq
    }
  })

  const isRomanUrdu = Object.values(romanUrduKeywords)
  .flat()
  .some(keyword => normalizedQuestion.includes(keyword))

const assistantMessage = bestMatch
  ? {
      role: 'assistant',
      content: `${isRomanUrdu ? romanUrduAnswers[bestMatch.id] : bestMatch.answer}\n\nSource: ${bestMatch.id}`,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  : {
      role: 'assistant',
      content: 'Sorry, I could not find this in the department FAQ. Please email helpdesk@se.example.edu or visit Room 210.',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

  setMessages(prev => [
    ...prev,
    userMessage,
    assistantMessage
  ])

  setChatInput('')
}

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>

        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={23} />
          </div>
          <div>
            <h2>AskSE<span>.</span></h2>
            <p>UNIVERSITY HELP DESK</p>
          </div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.name)
                  setMobileMenu(false)
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === 'Admin Panel' && (
                  <span className="admin-dot"></span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon"><Sparkles size={18} /></div>
            <h4>Need assistance?</h4>
            <p>AskSE is here to help you find university information.</p>
            <button onClick={() => setActivePage('AI Assistant')}>
              Start a conversation <ChevronRight size={15} />
            </button>
          </div>

          <button
            className="settings-link"
            onClick={() => setActivePage('Settings')}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="profile">
            <div className="avatar">SE</div>
            <div className="profile-info">
              <strong>AskSE Team</strong>
              <span>Administrator</span>
            </div>
            <Settings size={17} className="profile-settings" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <button className="mobile-menu" onClick={() => setMobileMenu(true)}>
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="system-status">
              <span className="status-indicator"></span>
              FAQ SYSTEM READY
            </div>
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={19} />
              <span></span>
            </button>
          </div>
        </header>

        {/* DASHBOARD */}
        <div className="dashboard">

          {activePage === 'AI Assistant' ? (
  <section className="chat-page">
    <div className="welcome-section">
      <div>
        <div className="eyebrow">
          <Sparkles size={15} /> ASKSE INTELLIGENCE
        </div>
        <h1>AI <span>Assistant.</span></h1>
        <p>Your personal university help desk. Ask anything about department FAQs.</p>
      </div>
      <div className="faq-total">
        <span className="status-indicator"></span> FAQ Knowledge Connected
      </div>
    </div>

    <div className="chat-container">
      <div className="chat-header">
        <div className="assistant-avatar">
          <Sparkles size={22} />
        </div>
       <div>
  <h3>AskSE Assistant</h3>
  <p>Your university information assistant</p>
</div>

<button
  className="clear-chat-btn"
  onClick={() => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I am AskSE, your university help desk assistant. How can I help you today?',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ])
    }
  }}
>
  <X size={16} />
  Clear Chat
</button>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? 'You' : <Sparkles size={17} />}
            </div>
            <div className="message-content">
  {message.content}

  <span className="message-time">
    {message.time || ''}
  </span>
</div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask about attendance, labs, exams..."
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => {
  if (e.key === 'Enter') {
    handleSendMessage()
  }
}}
        />

        <button
  className="send-btn"
  disabled={!chatInput.trim()}
  onClick={handleSendMessage}
>
          <ArrowUpRight size={19} />
        </button>
      </div>

      <p className="chat-disclaimer">
        AskSE provides information based on the department FAQ knowledge base.
      </p>
    </div>
  </section>
) : activePage === 'Admin Panel' ? (
  <section className="knowledge-page">
    <div className="welcome-section">
      <div>
        <div className="eyebrow">
          <ShieldCheck size={15} /> ASKSE ADMINISTRATION
        </div>
        <h1>Admin <span>Panel.</span></h1>
        <p>Manage and expand the department FAQ knowledge base.</p>
      </div>
      <div className="faq-total">{faqs.length} FAQs available</div>
    </div>

    {!adminUnlocked ? (
      <div className="chat-container" style={{ padding: '30px' }}>
        <h3>Administrator Login</h3>
        <p>Enter the administrator PIN to manage FAQs.</p>
        <input
          type="password"
          placeholder="Enter Admin PIN"
          value={adminPin}
          onChange={e => setAdminPin(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (adminPin === '2026') {
                setAdminUnlocked(true)
                setAdminPin('')
              } else {
                alert('Incorrect PIN!')
              }
            }
          }}
        />
        <button
          className="primary-btn"
          onClick={() => {
            if (adminPin === '2026') {
              setAdminUnlocked(true)
              setAdminPin('')
            } else {
              alert('Incorrect PIN!')
            }
          }}
        >
          <ShieldCheck size={17} /> Unlock Admin Panel
        </button>
      </div>
    ) : (
      <div className="chat-container" style={{ padding: '30px' }}>
        <div className="panel-heading">
          <div>
            <span className="section-eyebrow">FAQ MANAGEMENT</span>
            <h3>Add a new FAQ</h3>
            <p>New entries become available in the Knowledge Base immediately.</p>
          </div>
          <button
            className="text-btn"
            onClick={() => setAdminUnlocked(false)}
          >
            Lock Panel
          </button>
        </div>

        <div className="admin-form">
          <label htmlFor="faq-category">Category</label>
          <input
            id="faq-category"
            type="text"
            placeholder="e.g. Scholarships"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />

          <label htmlFor="faq-question">Question</label>
          <input
            id="faq-question"
            type="text"
            placeholder="Enter the frequently asked question"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />

          <label htmlFor="faq-answer">Answer</label>
          <textarea
            id="faq-answer"
            rows={5}
            placeholder="Enter the approved answer"
            value={newAnswer}
            onChange={e => setNewAnswer(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={() => {
              if (
                !newCategory.trim() ||
                !newQuestion.trim() ||
                !newAnswer.trim()
              ) {
                alert('Please fill in the category, question and answer.')
                return
              }

              const highestId = Math.max(
                0,
                ...faqs.map(faq => Number(faq.id.split('-')[1]) || 0)
              )
              const nextId = `FAQ-${String(highestId + 1).padStart(2, '0')}`

              setFaqs(previousFAQs => [
                ...previousFAQs,
                {
                  id: nextId,
                  category: newCategory.trim(),
                  question: newQuestion.trim(),
                  answer: newAnswer.trim()
                }
              ])

              setNewCategory('')
              setNewQuestion('')
              setNewAnswer('')
              alert(`FAQ added successfully: ${nextId}`)
            }}
          >
            <Plus size={17} /> Add FAQ
          </button>
        </div>
      </div>
    )}
  </section>
) : activePage === 'About AskSE' ? (
  <section className="knowledge-page">
    <div className="welcome-section">
      <div>
        <div className="eyebrow">
          <BookOpen size={15} /> ABOUT THE PROJECT
        </div>
        <h1>About <span>AskSE.</span></h1>
        <p>Your university information, organized in one simple help desk.</p>
      </div>
      <div className="faq-total">AskSE · 2026</div>
    </div>

    <div className="content-panel" style={{ padding: '30px', marginBottom: '22px' }}>
      <span className="section-eyebrow">OUR PURPOSE</span>
      <h3>Making department information easier to access.</h3>
      <p>
        AskSE is a university FAQ help desk prototype. It helps students
        find answers to common department questions through a searchable
        knowledge base and a chat-style question interface.
      </p>
    </div>

    <div className="content-panel" style={{ padding: '30px', marginBottom: '22px' }}>
      <span className="section-eyebrow">KEY FEATURES</span>
      <div className="assistant-features">
        <div><Database size={16} /> Searchable FAQ knowledge base</div>
        <div><MessageCircle size={16} /> English and Roman Urdu keyword support</div>
        <div><ShieldCheck size={16} /> Admin PIN and FAQ management</div>
        <div><Clock size={16} /> Chat history saved in this browser</div>
      </div>
    </div>

    <div className="content-panel" style={{ padding: '30px' }}>
      <span className="section-eyebrow">PROJECT DETAILS</span>
      <h3>AskSE — University Help Desk</h3>
      <p><strong>Technology:</strong> React, Vite, JavaScript and CSS</p>
      <p><strong>Response method:</strong> FAQ keyword matching (no external AI model is currently connected)</p>
      <p><strong>Developer:</strong> Mahnoor Naseem</p>
<p><strong>Entry ID:</strong> 70181728</p>
<p><strong>GitHub:</strong> <a href="https://github.com/mahnoor2381/askSE" target="_blank" rel="noreferrer">View Project on GitHub</a></p>
      <p><strong>Notice:</strong> This is a student project prototype. Verify university policies with the relevant department.</p>
    </div>
  </section>
) : activePage === 'Knowledge Base' ? (
  <section className="knowledge-page">
    <div className="welcome-section">
      <div>
        <div className="eyebrow">
          <Database size={15} /> DEPARTMENT INFORMATION
        </div>
        <h1>Knowledge <span>Base.</span></h1>
        <p>Browse the official FAQ records available in AskSE.</p>
      </div>
      <div className="faq-total">
        {faqs.length} FAQs available
      </div>
    </div>

    <div className="search-box knowledge-search">
      <Search size={18} />
      <input
        type="text"
        placeholder="Search by question, category or FAQ ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>

    <div className="faq-list">
      {filteredFAQs.map(faq => (
        <article className="faq-card" key={faq.id}>
          <div className="faq-card-top">
            <span className="faq-id">{faq.id}</span>
            <span className="faq-category">{faq.category}</span>
          </div>

          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </article>
      ))}

      {filteredFAQs.length === 0 && (
        <p className="empty-search">No matching FAQs found.</p>
      )}
    </div>
  </section>
) : (
  <>

          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <Sparkles size={15} /> UNIVERSITY INTELLIGENCE HUB
              </div>

              <h1>
                Welcome to <span>AskSE.</span>
              </h1>

              <p>
                Your university, one smarter help desk.
                Find answers, explore resources and get assistance.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setActivePage('AI Assistant')}
            >
              <Plus size={18} />
              New conversation
            </button>
          </section>

          {/* STATISTICS */}
          <section className="stats-grid">

            <div className="stat-card violet">
              <div className="stat-top">
                <div className="stat-icon"><MessageCircle size={21} /></div>
                <span className="stat-label">ACTIVITY</span>
              </div>
              <h2>—</h2>
              <p>Total questions asked</p>
              <span className="stat-note">Awaiting live data</span>
            </div>

            <div className="stat-card blue">
              <div className="stat-top">
                <div className="stat-icon"><Sparkles size={21} /></div>
                <span className="stat-label">AI RESPONSES</span>
              </div>
              <h2>—</h2>
              <p>Successfully answered</p>
              <span className="stat-note">Awaiting live data</span>
            </div>

            <div className="stat-card pink">
              <div className="stat-top">
                <div className="stat-icon"><Database size={21} /></div>
                <span className="stat-label">KNOWLEDGE</span>
              </div>
              <h2>{String(faqs.length).padStart(2, '0')}</h2>
<p>Available FAQ entries</p>
<span className="stat-note">Starter knowledge base</span>
            </div>

            <div className="stat-card cyan">
              <div className="stat-top">
                <div className="stat-icon"><ShieldCheck size={21} /></div>
                <span className="stat-label">SECURITY</span>
              </div>
              <h2>Active</h2>
              <p>Knowledge-based responses</p>
              <span className="stat-note">Grounded AI design</span>
            </div>

          </section>

          {/* CONTENT GRID */}
          <section className="content-grid">

            <div className="content-panel categories-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-eyebrow">EXPLORE RESOURCES</span>
                  <h3>Knowledge categories</h3>
                  <p>Find information by department topic.</p>
                </div>
                <button
                  className="text-btn"
                  onClick={() => setActivePage('Knowledge Base')}
                >
                  View all <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="category-grid">
                {filteredCategories.map(category => {
                  const Icon = category.icon

                  return (
                    <button
                      className="category-card"
                      key={category.name}
                      onClick={() => setActivePage('Knowledge Base')}
                    >
                      <div className={`category-icon ${category.color}`}>
                        <Icon size={21} />
                      </div>
                      <div>
                        <h4>{category.name}</h4>
                        <span>{category.count} FAQ available</span>
                      </div>
                      <ChevronRight size={17} className="category-arrow" />
                    </button>
                  )
                })}
                {filteredCategories.length === 0 && (
                  <p className="empty-search">No matching categories found.</p>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="content-panel assistant-panel">
              <div className="assistant-glow"></div>

              <div className="assistant-heading">
                <div className="assistant-avatar">
                  <Sparkles size={23} />
                </div>
                <span className="online-tag">ONLINE</span>
              </div>

              <span className="section-eyebrow">YOUR AI ASSISTANT</span>
              <h3>Questions? We've got answers.</h3>

              <p>
                Ask about lab timings, attendance, exams, fees,
                university transport and more.
              </p>

              <div className="assistant-features">
                <div><ShieldCheck size={16} /> FAQ-grounded answers</div>
                <div><MessageCircle size={16} /> English & Roman Urdu</div>
                <div><Clock size={16} /> Available whenever you need</div>
              </div>

              <button
                className="assistant-btn"
                onClick={() => setActivePage('AI Assistant')}
              >
                Chat with AskSE <ChevronRight size={17} />
              </button>
            </div>

          </section>

          {/* BOTTOM SECTION */}
          <section className="bottom-panel">
            <div className="bottom-icon">
              <BookOpen size={22} />
            </div>
            <div>
              <h4>Your university information, organized.</h4>
              <p>
                AskSE uses the department FAQ knowledge base to
                provide reliable, source-cited information.
              </p>
            </div>
            <div className="bottom-badge">
              <ShieldCheck size={16} /> Knowledge grounded
            </div>
          </section>

          <footer className="footer">
            <span>© 2026 AskSE. University Help Desk.</span>
            <span>Built for CodeQuest 2026</span>
          </footer>
          </>
          )}

        </div>
      </main>
    </div>
  )
}

export default App
