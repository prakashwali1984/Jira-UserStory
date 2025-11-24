import { useState } from 'react'
import { generateTests } from './api'
import { GenerateRequest, GenerateResponse, TestCase } from './types'

function App() {
  const [showJiraModal, setShowJiraModal] = useState<boolean>(false)
  const [jiraCredentials, setJiraCredentials] = useState({ url: '', email: '', apiToken: '' })
  const [jiraConnected, setJiraConnected] = useState<boolean>(false)
  const [jiraTickets, setJiraTickets] = useState<string[]>([])
  const [selectedJiraTicket, setSelectedJiraTicket] = useState<string>('')
  const [jiraStoryId, setJiraStoryId] = useState<string>('')
  const [formData, setFormData] = useState<GenerateRequest>({
    storyTitle: '',
    acceptanceCriteria: '',
    description: '',
    additionalInfo: ''
  })
  const [results, setResults] = useState<GenerateResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set())

  const toggleTestCaseExpansion = (testCaseId: string) => {
    const newExpanded = new Set(expandedTestCases)
    if (newExpanded.has(testCaseId)) {
      newExpanded.delete(testCaseId)
    } else {
      newExpanded.add(testCaseId)
    }
    setExpandedTestCases(newExpanded)
  }

  const handleInputChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenJiraModal = () => {
    setShowJiraModal(true)
  }

  const handleCloseJiraModal = () => {
    setShowJiraModal(false)
  }

  const handleJiraCredentialChange = (field: string, value: string) => {
    setJiraCredentials(prev => ({ ...prev, [field]: value }))
  }

  const handleConnectToJira = () => {
    // Validate credentials
    if (!jiraCredentials.url || !jiraCredentials.email || !jiraCredentials.apiToken) {
      alert('Please fill in all JIRA account details')
      return
    }
    
    // TODO: Implement actual JIRA OAuth/API integration
    setJiraConnected(true)
    setShowJiraModal(false)
    // Mock linked tickets for demo
    setJiraTickets(['PROJ-123', 'PROJ-456', 'PROJ-789', 'PROJ-101', 'PROJ-202'])
    
    // Success notification
    alert('✅ Connected to JIRA successfully!')
  }

  const handleDisconnectJira = () => {
    setJiraConnected(false)
    setJiraTickets([])
    setSelectedJiraTicket('')
    setJiraCredentials({ url: '', email: '', apiToken: '' })
    alert('Disconnected from JIRA')
  }

  const handleFetchFromJira = () => {
    // TODO: Implement JIRA API integration
    console.log('Fetching JIRA story:', jiraStoryId)
    alert(`Demo: Would fetch story ${jiraStoryId} from JIRA`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.storyTitle.trim() || !formData.acceptanceCriteria.trim()) {
      setError('Story Title and Acceptance Criteria are required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await generateTests(formData)
      setResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }

        .container {
          max-width: 95%;
          width: 100%;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
        }

        @media (min-width: 768px) {
          .container {
            max-width: 90%;
            padding: 30px;
          }
        }

        @media (min-width: 1024px) {
          .container {
            max-width: 85%;
            padding: 40px;
          }
        }

        @media (min-width: 1440px) {
          .container {
            max-width: 1800px;
            padding: 50px;
          }
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1.1rem;
        }

        .form-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .jira-input-group {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .jira-input-wrapper {
          flex: 1;
        }

        .fetch-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
        }

        .fetch-btn:hover:not(:disabled) {
          background: #229954;
        }

        .fetch-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .jira-integration-box {
          background: #f4f5f7;
          border: 2px solid #0052CC;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .jira-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .jira-title {
          font-size: 1.3rem;
          color: #0052CC;
          margin: 0;
        }

        .jira-connect-btn {
          background: #0052CC;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .jira-connect-btn:hover {
          background: #0747A6;
        }

        .jira-disconnect-btn {
          background: #DE350B;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .jira-disconnect-btn:hover {
          background: #BF2600;
        }

        .jira-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .jira-status-text {
          color: #00875A;
          font-weight: 600;
          font-size: 16px;
        }

        .jira-description {
          color: #5E6C84;
          margin-bottom: 15px;
        }

        .jira-select {
          width: 100%;
          padding: 12px;
          border: 2px solid #DFE1E6;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s;
        }

        .jira-select:focus {
          outline: none;
          border-color: #0052CC;
        }

        .selected-ticket-info {
          margin-top: 10px;
          padding: 10px;
          background: white;
          border-radius: 4px;
          color: #5E6C84;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e8ed;
        }

        .modal-title {
          font-size: 1.5rem;
          color: #0052CC;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background: #f4f5f7;
        }

        .modal-body {
          margin-bottom: 20px;
        }

        .modal-description {
          color: #5E6C84;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .modal-form-group {
          margin-bottom: 18px;
        }

        .modal-label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #2c3e50;
          font-size: 14px;
        }

        .modal-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #DFE1E6;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .modal-input:focus {
          outline: none;
          border-color: #0052CC;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-btn-cancel {
          background: #f4f5f7;
          color: #5E6C84;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-btn-cancel:hover {
          background: #e4e6e9;
        }

        .modal-btn-connect {
          background: #0052CC;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-btn-connect:hover {
          background: #0747A6;
        }

        .error-banner {
          background: #e74c3c;
          color: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 18px;
        }

        .results-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .results-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e8ed;
        }

        .results-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .results-meta {
          color: #666;
          font-size: 14px;
        }

        .table-container {
          overflow-x: auto;
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .results-table th,
        .results-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e1e8ed;
        }

        .results-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }

        .results-table tr:hover {
          background: #f8f9fa;
        }

        .category-positive { color: #27ae60; font-weight: 600; }
        .category-negative { color: #e74c3c; font-weight: 600; }
        .category-edge { color: #f39c12; font-weight: 600; }
        .category-authorization { color: #9b59b6; font-weight: 600; }
        .category-non-functional { color: #34495e; font-weight: 600; }

        .test-case-id {
          cursor: pointer;
          color: #3498db;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .test-case-id:hover {
          background: #f8f9fa;
        }

        .test-case-id.expanded {
          background: #e3f2fd;
          color: #1976d2;
        }

        .expand-icon {
          font-size: 10px;
          transition: transform 0.2s;
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }

        .expanded-details {
          margin-top: 15px;
          background: #fafbfc;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 20px;
        }

        .step-item {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .step-header {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          align-items: start;
        }

        .step-id {
          font-weight: 600;
          color: #2c3e50;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }

        .step-description {
          color: #2c3e50;
          line-height: 1.5;
        }

        .step-test-data {
          color: #666;
          font-style: italic;
          font-size: 14px;
        }

        .step-expected {
          color: #27ae60;
          font-weight: 500;
          font-size: 14px;
        }

        .step-labels {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 className="title">User Story to Tests</h1>
          <p className="subtitle">Generate comprehensive test cases from your user stories</p>
        </div>

        <div className="jira-integration-box">
          <div className="jira-header">
            <h3 className="jira-title">🔗 JIRA Integration</h3>
          </div>
          
          {!jiraConnected ? (
            <div>
              <p className="jira-description">Connect to JIRA to link your account and access your tickets</p>
              <button
                type="button"
                className="jira-connect-btn"
                onClick={handleOpenJiraModal}
              >
                Connect to JIRA
              </button>
            </div>
          ) : (
            <div>
              <div className="jira-status">
                <span className="jira-status-text">✅ Connected to JIRA</span>
                <button
                  type="button"
                  className="jira-disconnect-btn"
                  onClick={handleDisconnectJira}
                >
                  Disconnect
                </button>
              </div>
              
              <div className="form-group">
                <label htmlFor="jiraTicketSelect" className="form-label">
                  Select from your linked JIRA tickets:
                </label>
                <select
                  id="jiraTicketSelect"
                  className="jira-select"
                  value={selectedJiraTicket}
                  onChange={(e) => setSelectedJiraTicket(e.target.value)}
                >
                  <option value="">-- Select a JIRA ticket --</option>
                  {jiraTickets.map((ticket) => (
                    <option key={ticket} value={ticket}>
                      {ticket}
                    </option>
                  ))}
                </select>
                {selectedJiraTicket && (
                  <div className="selected-ticket-info">
                    Selected: <strong>{selectedJiraTicket}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="jiraStoryId" className="form-label">
              JIRA User Story ID
            </label>
            <div className="jira-input-group">
              <div className="jira-input-wrapper">
                <input
                  type="text"
                  id="jiraStoryId"
                  className="form-input"
                  value={jiraStoryId}
                  onChange={(e) => setJiraStoryId(e.target.value)}
                  placeholder="Enter JIRA story ID (e.g., PROJ-123)..."
                />
              </div>
              <button
                type="button"
                className="fetch-btn"
                onClick={handleFetchFromJira}
                disabled={!jiraStoryId.trim()}
              >
                Fetch from JIRA
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="storyTitle" className="form-label">
              Story Title *
            </label>
            <input
              type="text"
              id="storyTitle"
              className="form-input"
              value={formData.storyTitle}
              onChange={(e) => handleInputChange('storyTitle', e.target.value)}
              placeholder="Enter the user story title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional description (optional)..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="acceptanceCriteria" className="form-label">
              Acceptance Criteria *
            </label>
            <textarea
              id="acceptanceCriteria"
              className="form-textarea"
              value={formData.acceptanceCriteria}
              onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
              placeholder="Enter the acceptance criteria..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              className="form-textarea"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information (optional)..."
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            Generating test cases...
          </div>
        )}

        {results && (
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">Generated Test Cases</h2>
              <div className="results-meta">
                {results.cases.length} test case(s) generated
                {results.model && ` • Model: ${results.model}`}
                {results.promptTokens > 0 && ` • Tokens: ${results.promptTokens + results.completionTokens}`}
              </div>
            </div>

            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Test Case ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Expected Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cases.map((testCase: TestCase) => (
                    <>
                      <tr key={testCase.id}>
                        <td>
                          <div
                            className={`test-case-id ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}
                            onClick={() => toggleTestCaseExpansion(testCase.id)}
                          >
                            <span className={`expand-icon ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}>
                              ▶
                            </span>
                            {testCase.id}
                          </div>
                        </td>
                        <td>{testCase.title}</td>
                        <td>
                          <span className={`category-${testCase.category.toLowerCase()}`}>
                            {testCase.category}
                          </span>
                        </td>
                        <td>{testCase.expectedResult}</td>
                      </tr>
                      {expandedTestCases.has(testCase.id) && (
                        <tr key={`${testCase.id}-details`}>
                          <td colSpan={4}>
                            <div className="expanded-details">
                              <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>Test Steps for {testCase.id}</h4>
                              <div className="step-labels">
                                <div>Step ID</div>
                                <div>Step Description</div>
                                <div>Test Data</div>
                                <div>Expected Result</div>
                              </div>
                              {testCase.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                  <div className="step-header">
                                    <div className="step-id">S{String(index + 1).padStart(2, '0')}</div>
                                    <div className="step-description">{step}</div>
                                    <div className="step-test-data">{testCase.testData || 'N/A'}</div>
                                    <div className="step-expected">
                                      {index === testCase.steps.length - 1 ? testCase.expectedResult : 'Step completed successfully'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showJiraModal && (
          <div className="modal-overlay" onClick={handleCloseJiraModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">🔗 Connect to JIRA</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseJiraModal}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <p className="modal-description">
                  Enter your JIRA account details to connect and access your tickets
                </p>

                <div className="modal-form-group">
                  <label htmlFor="jiraUrl" className="modal-label">
                    JIRA URL *
                  </label>
                  <input
                    type="text"
                    id="jiraUrl"
                    className="modal-input"
                    value={jiraCredentials.url}
                    onChange={(e) => handleJiraCredentialChange('url', e.target.value)}
                    placeholder="https://your-domain.atlassian.net"
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="jiraEmail" className="modal-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="jiraEmail"
                    className="modal-input"
                    value={jiraCredentials.email}
                    onChange={(e) => handleJiraCredentialChange('email', e.target.value)}
                    placeholder="your-email@example.com"
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="jiraToken" className="modal-label">
                    API Token *
                  </label>
                  <input
                    type="password"
                    id="jiraToken"
                    className="modal-input"
                    value={jiraCredentials.apiToken}
                    onChange={(e) => handleJiraCredentialChange('apiToken', e.target.value)}
                    placeholder="Enter your JIRA API token"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={handleCloseJiraModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-btn-connect"
                  onClick={handleConnectToJira}
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App