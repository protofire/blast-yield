import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { Deferrable } from '@ethersproject/properties';
import type { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { TokenType, type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk';
import { Interface } from 'ethers';

import { YieldMode } from '@/config/yieldTokens';
import { safeParseUnits } from '@/utils/formatters';

//TODO: fetch ABI from gateway
export const encodeChangeYieldMode = (
  yieldMode: YieldMode,
  token: TokenInfo
): SafeTransactionDataPartial => {
  let functionName;
  let functionABI;
  let args;
  if (token.type === TokenType.NATIVE_TOKEN) {
    switch (yieldMode) {
      case YieldMode.CLAIMABLE:
        functionName = 'configureClaimableYield';
        break;
      case YieldMode.AUTOMATIC:
        functionName = 'configureAutomaticYield';
        break;
      default:
        functionName = 'configureVoidYield';
        break;
    }
    functionABI = `function ${functionName}() external`;
  } else {
    functionName = 'configure';
    functionABI = `function ${functionName}(uint8 yieldMode) external`;
    args = [yieldMode];
  }

  const yieldModeInterface = new Interface([functionABI]);

  return {
    to: token.address,
    value: '0',
    data: yieldModeInterface.encodeFunctionData(functionName, args ?? []),
  };
};

export const encodeGetYieldMode = (
  contractAddress: string,
  token: TokenInfo
): Deferrable<TransactionRequest> => {
  if (!token.address) {
    throw new Error('Token address is required');
  }

  const functionName =
    token.type === TokenType.NATIVE_TOKEN ? 'readYieldConfiguration' : 'getConfiguration';
  const functionABI = `function ${functionName}(address contractAddress) external`;

  const yieldContractInterface = new Interface([functionABI]);

  return {
    to: token.address,
    value: '0',
    data: yieldContractInterface.encodeFunctionData(functionName, [contractAddress]),
  };
};

export const encodeGetClaimableYield = (
  contractAddress: string,
  token: TokenInfo
): Deferrable<TransactionRequest> => {
  if (!token.address) {
    throw new Error('Token address is required');
  }

  const functionName =
    token.type === TokenType.NATIVE_TOKEN ? 'readClaimableYield' : 'getClaimableAmount';
  const functionABI = `function ${functionName}(address contractAddress) external`;

  const yieldContractInterface = new Interface([functionABI]);

  return {
    to: token.address,
    value: '0',
    data: yieldContractInterface.encodeFunctionData(functionName, [contractAddress]),
  };
};

export const encodeClaimYield = (
  contractAddress: string,
  recipientOfYield: string,
  token: TokenInfo,
  amount: string
): SafeTransactionDataPartial => {
  if (!token.address) {
    throw new Error('Token address is required');
  }

  const functionName = token.type === TokenType.NATIVE_TOKEN ? 'claimYield' : 'claim';

  const functionABI = `function ${functionName}${
    token.type === TokenType.NATIVE_TOKEN
      ? '(address contractAddress, address recipientOfYield, uint256 amount)'
      : '(address recipient, uint256 amount)'
  } external`;

  const parsedAmount = safeParseUnits(amount, token.decimals)?.toString() || '0';

  const args =
    token.type === TokenType.NATIVE_TOKEN
      ? [contractAddress, recipientOfYield, parsedAmount]
      : [recipientOfYield, parsedAmount];

  const yieldContractInterface = new Interface([functionABI]);

  return {
    to: token.address,
    value: '0',
    data: yieldContractInterface.encodeFunctionData(functionName, args),
  };
};
