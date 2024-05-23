import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { fromNano } from '@ton/core';
import { useTonConnect } from './hooks/useTonConnect';

// owner EQAomCdjy5XAE7u1HP294s6rL3suN4B_sPu3Hbx06OgNWhdN
// contract EQCdRvdN0C7oET4pmzUUUctui3R8Mt1AWP9FGsR8KaYHO-Q-

function App() {
  const {
    contract_address,
    contract_balance,
    counter_value,
    recent_sender,
    owner_address,
    sendIncrement,
    sendDeposit,
    sendWithdraw,
    sendDestroy
  } = useMainContract();

  const { connected } = useTonConnect();

  return <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Contract address:</b>
          <div className="Hint">
            {contract_address?.slice(0, 30) + "..."}
          </div>
          {contract_balance !== null &&
            <div>
              <b>Contract balance:</b>
              <div className="Hint">
                {fromNano(BigInt(contract_balance ?? 0))} TON
              </div>
            </div>
          }
        </div>

        <div className="Card">
          <b>Contract owner:</b>
          <div className="Hint">
            {owner_address?.toString() ?? "Loading..."}
          </div>
          <b>Recent sender:</b>
          <div className="Hint">
            {recent_sender?.toString() ?? "Loading..."}
          </div>
        </div>

        <div className="Card">
          <b>Counter value:</b>
          <div>
            {counter_value ?? "Loading..."}
          </div>
        </div>

        {/* increment by 5 */}
        {connected && (
          <a onClick={() => {
            sendIncrement();
          }}>
            Increment by 5
          </a>
        )}

        <br />

        {/* make deposit */}
        {connected && (
          <a onClick={() => {
            sendDeposit();
          }}>
            Deposit 0.1 TON
          </a>
        )}

        <br />

        {/* make withdraw */}
        {connected && (
          <a onClick={() => {
            sendWithdraw(0.05);
          }}>
            Withdraw 0.05 TON
          </a>
        )}

        {/* make destroy */}
        {connected && (
          <a onClick={() => {
            sendDestroy();
          }}>
            Destroy contract
          </a>
        )}
      </div>
    </div>;
}

export default App;
