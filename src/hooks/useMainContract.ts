import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const tonClient = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const [contractData, setContractData] = useState<null | {
    counter_value: number,
    recent_sender: Address,
    owner_address: Address
  }>();

  const [balance, setBalance] = useState<null | number>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!tonClient) {
      return;
    }

    const address = Address.parse("EQCdRvdN0C7oET4pmzUUUctui3R8Mt1AWP9FGsR8KaYHO-Q-");
    const contract = new MainContract(address);
    return tonClient.open(contract) as OpenedContract<MainContract>;
  }, [tonClient]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) {
        return;
      }

      setContractData(null);
      const data = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: data.sum,
        recent_sender: data.recent_sender,
        owner_address: data.owner
      });
      setBalance(balance);
      await sleep(5000);  // Update every 5 seconds
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: async() => {
      return mainContract?.sendIncrementMessage(sender, BigInt(5));
    },
    sendDeposit: async() => {
      return mainContract?.sendDepositMessage(sender, toNano(0.1));
    },
    sendWithdraw: async(amount: number) => {
      return mainContract?.sendWithdrawMessage(sender, toNano(amount));
    },
    sendDestroy: async() => {
      return mainContract?.sendDestroyMessage(sender);
    }
  }
}
