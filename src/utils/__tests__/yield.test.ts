import { TokenType } from '@safe-global/safe-gateway-typescript-sdk';

import { YieldMode } from '@/config/yieldTokens';

import {
  encodeChangeYieldMode,
  encodeGetYieldMode,
  encodeGetClaimableYield,
  encodeClaimYield,
} from '../yield';

describe('yield utilities', () => {
  const mockNativeToken = {
    type: TokenType.NATIVE_TOKEN,
    address: '0x4200000000000000000000000000000000000023',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    logoUri: 'null',
  };

  const mockERC20Token = {
    type: TokenType.ERC20,
    address: '0x4200000000000000000000000000000000000024',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    logoUri: 'null',
  };

  const mockContractAddress = '0x1234567890123456789012345678901234567890';
  const mockRecipient = '0x0987654321098765432109876543210987654321';

  describe('encodeChangeYieldMode', () => {
    it('should encode native token claimable yield mode', () => {
      const result = encodeChangeYieldMode(YieldMode.CLAIMABLE, mockNativeToken);

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe('0xf098767a');
    });

    it('should encode native token automatic yield mode', () => {
      const result = encodeChangeYieldMode(YieldMode.AUTOMATIC, mockNativeToken);

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe('0x7114177a');
    });

    it('should encode native token void yield mode', () => {
      const result = encodeChangeYieldMode(YieldMode.VOID, mockNativeToken);

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe('0xaa857d98');
    });

    it('should encode ERC20 token yield mode', () => {
      const result = encodeChangeYieldMode(YieldMode.AUTOMATIC, mockERC20Token);

      expect(result.to).toBe(mockERC20Token.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0x1a33757d0000000000000000000000000000000000000000000000000000000000000000'
      );
    });
  });

  describe('encodeGetYieldMode', () => {
    it('should encode get yield mode for native token', () => {
      const result = encodeGetYieldMode(mockContractAddress, mockNativeToken);

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xfd8c4b9d0000000000000000000000001234567890123456789012345678901234567890'
      );
    });

    it('should encode get yield mode for ERC20 token', () => {
      const result = encodeGetYieldMode(mockContractAddress, mockERC20Token);

      expect(result.to).toBe(mockERC20Token.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xc44b11f70000000000000000000000001234567890123456789012345678901234567890'
      );
    });
  });

  describe('encodeGetClaimableYield', () => {
    it('should encode get claimable yield for native token', () => {
      const result = encodeGetClaimableYield(mockContractAddress, mockNativeToken);

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xec3278e80000000000000000000000001234567890123456789012345678901234567890'
      );
    });

    it('should encode get claimable yield for ERC20 token', () => {
      const result = encodeGetClaimableYield(mockContractAddress, mockERC20Token);

      expect(result.to).toBe(mockERC20Token.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xe12f3a610000000000000000000000001234567890123456789012345678901234567890'
      );
    });
  });

  describe('encodeClaimYield', () => {
    it('should encode claim yield for native token', () => {
      const result = encodeClaimYield(mockContractAddress, mockRecipient, mockNativeToken, '1');

      expect(result.to).toBe(mockNativeToken.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xf9719662000000000000000000000000123456789012345678901234567890123456789000000000000000000000000009876543210987654321098765432109876543210000000000000000000000000000000000000000000000000de0b6b3a7640000'
      );
    });

    it('should encode claim yield for ERC20 token', () => {
      const result = encodeClaimYield(mockContractAddress, mockRecipient, mockERC20Token, '0.5');

      expect(result.to).toBe(mockERC20Token.address);
      expect(result.value).toBe('0');
      expect(result.data).toBe(
        '0xaad3ec960000000000000000000000000987654321098765432109876543210987654321000000000000000000000000000000000000000000000000000000000007a120'
      );
    });

    it('should throw error for zero amount', () => {
      expect(() =>
        encodeClaimYield(mockContractAddress, mockRecipient, mockNativeToken, '0')
      ).toThrow('Amount must be greater than 0');
    });
  });
});
