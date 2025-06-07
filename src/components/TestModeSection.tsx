import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BeakerIcon, UserPlusIcon, CreditCardIcon } from 'lucide-react';

const TestModeSection: React.FC = () => {
  const { settings, updateSettings, testUser, createTestUser, updateTestUser } = useAppContext();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createTestUser(email, name);
    setShowCreateUser(false);
    setEmail('');
    setName('');
  };

  const handleUpdateSubscription = (plan: 'basic' | 'pro' | 'enterprise') => {
    updateTestUser({
      subscriptionPlan: plan,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleUpdateStatus = (status: 'active' | 'canceled' | 'past_due' | 'unpaid') => {
    updateTestUser({ subscriptionStatus: status });
  };

  return (
    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <BeakerIcon size={20} className="text-purple-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
          Test Mode
        </h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Enable test mode for development
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use test cards and simulate subscription events
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.testMode}
            onChange={() => updateSettings({ testMode: !settings.testMode })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {settings.testMode && (
        <div className="space-y-4">
          {!testUser ? (
            <div>
              <button
                onClick={() => setShowCreateUser(true)}
                className="w-full py-2 px-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center"
              >
                <UserPlusIcon size={16} className="mr-1" />
                Create Test User
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                    {testUser.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testUser.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <CreditCardIcon size={14} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    •••• {testUser.cardLast4}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscription Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['basic', 'pro', 'enterprise'] as const).map((plan) => (
                      <button
                        key={plan}
                        onClick={() => handleUpdateSubscription(plan)}
                        className={`py-1 px-2 text-xs rounded-lg capitalize ${
                          testUser.subscriptionPlan === plan
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscription Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['active', 'canceled', 'past_due', 'unpaid'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className={`py-1 px-2 text-xs rounded-lg capitalize ${
                          testUser.subscriptionStatus === status
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Next billing: {new Date(testUser.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showCreateUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Create Test User
                </h3>
                <form onSubmit={handleCreateUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateUser(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
              Test Card Numbers
            </h4>
            <div className="space-y-2 text-xs text-purple-700 dark:text-purple-400">
              <p>• 4242 4242 4242 4242 (Success)</p>
              <p>• 4000 0000 0000 0341 (Failed)</p>
              <p>• 4000 0000 0000 9995 (Insufficient Funds)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModeSection;