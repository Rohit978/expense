import React, { useState } from 'react';
import { Plus, Send, CheckCircle, XCircle, Clock, User, Users, Shield, ChevronDown, DollarSign, FileText, TrendingUp, Menu, X } from 'lucide-react';

const ExpenseManagementApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState('employee');
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 1250, category: 'Travel', status: 'approved', date: '2025-10-01', approver: 'Manager' },
    { id: 2, amount: 450, category: 'Meals', status: 'pending', date: '2025-10-02', approver: 'Finance' },
    { id: 3, amount: 890, category: 'Equipment', status: 'rejected', date: '2025-09-28', approver: 'Manager' }
  ]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const handleSubmitExpense = () => {
    if (newExpense.amount && newExpense.category && newExpense.date) {
      setExpenses([
        {
          id: expenses.length + 1,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          status: 'pending',
          date: newExpense.date,
          approver: 'Manager'
        },
        ...expenses
      ]);
      setNewExpense({ amount: '', category: '', description: '', date: '' });
      setShowSubmitModal(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };
    const icons = {
      approved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const RoleCard = ({ role, icon, permissions, isActive }) => (
    <div 
      onClick={() => setSelectedRole(role.toLowerCase())}
      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl' : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-bold">{role}</h3>
      </div>
      <ul className="space-y-2 text-sm">
        {permissions.map((perm, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{perm}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const ApprovalFlow = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Approval Workflow</h3>
      <div className="space-y-6">
        <div className="relative">
          <div className="flex items-center justify-between">
            {['Manager', 'Finance', 'Director'].map((step, idx) => (
              <div key={idx} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'
                  } text-white shadow-lg transform transition-transform hover:scale-110`}>
                    <span className="text-xl font-bold">{idx + 1}</span>
                  </div>
                  <p className="mt-3 font-semibold text-gray-700">{step}</p>
                </div>
                {idx < 2 && (
                  <div className="absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
          <h4 className="font-bold text-lg mb-3 text-gray-800">Conditional Approval Rules</h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <span><strong>Percentage Rule:</strong> If 60% of approvers approve → Auto-approved</span>
            </li>
            <li className="flex items-start gap-2">
              <User className="w-5 h-5 text-purple-600 mt-0.5" />
              <span><strong>Specific Approver:</strong> If CFO approves → Auto-approved</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-5 h-5 text-green-600 mt-0.5" />
              <span><strong>Hybrid Rule:</strong> Combine both rules for flexibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExpenseFlow
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {['dashboard', 'submit', 'workflow', 'roles'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-2">
              {['dashboard', 'submit', 'workflow', 'roles'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-left ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Expense Dashboard</h2>
                <p className="text-gray-600 mt-2">Track and manage all your expenses</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Expense
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Submitted</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">${expenses.reduce((sum, e) => sum + e.amount, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{expenses.filter(e => e.status === 'pending').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Approved</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{expenses.filter(e => e.status === 'approved').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Approver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, idx) => (
                      <tr key={expense.id} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4">{expense.date}</td>
                        <td className="px-6 py-4 font-medium">{expense.category}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">${expense.amount}</td>
                        <td className="px-6 py-4"><StatusBadge status={expense.status} /></td>
                        <td className="px-6 py-4 text-gray-600">{expense.approver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Submit Expense */}
        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Submit New Expense</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="Travel">Travel</option>
                    <option value="Meals">Meals</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Add expense details..."
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitExpense}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Submit Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workflow */}
        {activeTab === 'workflow' && (
          <div className="animate-fade-in">
            <ApprovalFlow />
          </div>
        )}

        {/* Roles */}
        {activeTab === 'roles' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Roles & Permissions</h2>
              <p className="text-gray-600">Manage user roles and their permissions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                role="Employee"
                icon={<User className="w-8 h-8" />}
                permissions={[
                  'Submit expenses',
                  'View own expenses',
                  'Check approval status',
                  'Upload receipts (OCR)'
                ]}
                isActive={selectedRole === 'employee'}
              />
              <RoleCard
                role="Manager"
                icon={<Users className="w-8 h-8" />}
                permissions={[
                  'Approve/reject expenses',
                  'View team expenses',
                  'Escalate to higher approval',
                  'Add comments'
                ]}
                isActive={selectedRole === 'manager'}
              />
              <RoleCard
                role="Admin"
                icon={<Shield className="w-8 h-8" />}
                permissions={[
                  'Create company & users',
                  'Configure approval rules',
                  'Set roles & permissions',
                  'Override approvals'
                ]}
                isActive={selectedRole === 'admin'}
              />
            </div>
          </div>
        )}
      </main>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Quick Submit</h3>
            <p className="text-gray-600 mb-6">Create a new expense quickly</p>
            <button
              onClick={() => {
                setShowSubmitModal(false);
                setActiveTab('submit');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Go to Submit Form
            </button>
            <button
              onClick={() => setShowSubmitModal(false)}
              className="w-full mt-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExpenseManagementApp;