import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import BN from 'bn.js';

const FIELD_MODULUS = BigInt('8444461749428370424248824938781546531375899335154063827935233455917409239040');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIOS() {
  if (typeof window === 'undefined') return false;
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) &&
      window.navigator.maxTouchPoints > 0)
  );
}

export function isAndroid() {
  if (typeof window === 'undefined') return false;
  return /Android/gi.test(window.navigator.userAgent);
}

export function isMobile() {
  return isIOS() || isAndroid();
}

export function safeParseInt(value: string): number {
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? 0 : parsedValue;
}

export function stringToBigInt(
  input: string,
  reverse: boolean = false
): bigint {
  const encoder = new TextEncoder();
  const encodedBytes = encoder.encode(input);
  reverse && encodedBytes.reverse();

  let bigIntValue = BigInt(0);
  for (let i = 0; i < encodedBytes.length; i++) {
    const byteValue = BigInt(encodedBytes[i]);
    const shiftedValue = byteValue << BigInt(8 * i);
    bigIntValue = bigIntValue | shiftedValue;
  }

  return bigIntValue;
}

function bigIntToString(bigIntValue: bigint, reverse: boolean = false) {
  const bytes = [];
  let tempBigInt = bigIntValue;

  while (tempBigInt > BigInt(0)) {
    const byteValue = Number(tempBigInt & BigInt(255));
    bytes.push(byteValue);
    tempBigInt = tempBigInt >> BigInt(8);
  }

  reverse && bytes.reverse();

  const decoder = new TextDecoder();
  const asciiString = decoder.decode(Uint8Array.from(bytes));
  return asciiString;
}

export function splitStringToBigInts(input: string): bigint[] {
  const encoder = new TextEncoder(); // Create a new TextEncoder instance
  const inputBytes = encoder.encode(input); // Encode the input string as bytes
  const chunkSize = 16; // Chunk size to split the string in bytes
  const numChunks = Math.ceil(inputBytes.length / chunkSize);
  const bigInts: bigint[] = [];

  for (let i = 0; i < numChunks; i++) {
    const chunkStart = i * chunkSize;
    const chunkEnd = chunkStart + chunkSize;
    const chunk = inputBytes.slice(chunkStart, chunkEnd);
    let bigIntValue = BigInt(0);
    for (let i = 0; i < chunk.length; i++) {
      const byteValue = BigInt(chunk[i]);
      const shiftedValue = byteValue << BigInt(8 * i);
      bigIntValue = bigIntValue | shiftedValue;
    }
    bigInts.push(bigIntValue);
  }

  return bigInts;
}

export function stringToFields(input: string, numFieldElements = 4) {
  const bigIntValue = stringToBigInt(input, true);
  const fieldElements = [];
  let remainingValue = bigIntValue;
  for (let i = 0; i < numFieldElements; i++) {
    const fieldElement = remainingValue % FIELD_MODULUS;
    fieldElements.push(fieldElement.toString() + 'field');
    remainingValue = remainingValue / FIELD_MODULUS;
  }
  if (remainingValue !== BigInt(0)) {
    throw new Error('String is too big to be encoded.');
  }
  return fieldElements;
}

export function fieldsToString(fields: bigint[]) {
  let bigIntValue = BigInt(0);
  let multiplier = BigInt(1);
  for (const fieldElement of fields) {
    bigIntValue += fieldElement * multiplier;
    multiplier *= FIELD_MODULUS;
  }
  return bigIntToString(bigIntValue, true);
}

export function joinBigIntsToString(bigInts: bigint[]): string {
  let result = '';

  for (let i = 0; i < bigInts.length; i++) {
    const chunkString = bigIntToString(bigInts[i]);
    result += chunkString;
  }

  return result;
}

export function padArray(array: bigint[], length: number): bigint[] {
  const paddingLength = length - array.length;
  if (paddingLength <= 0) {
    return array; // No padding needed
  }

  const padding = Array(paddingLength).fill(BigInt(0));
  const paddedArray = array.concat(padding);
  return paddedArray;
}

export function getFormattedNameInput(name: string, length: number): string {
  const nameInputs = padArray(splitStringToBigInts(name), length);
  return `[${nameInputs.map((i) => i + 'u128').join(',')}]`;
}

export function getFormattedU128Input(str: string): string {
  const bint = stringToBigInt(str);
  return `${bint}u128`;
}

export function getFormattedFieldsInput(text: string, length: number): string {
  const fields = stringToFields(text, length);
  return `[${fields.join(',')}]`;
}

export function parseStringToBigIntArray(input: string): bigint[] {
  const bigIntRegex = /([0-9]+)u128/g;
  const matches = input.match(bigIntRegex);

  if (!matches) {
    return [];
  }

  const bigInts = matches.map((match) => BigInt(match.slice(0, -4)));
  return bigInts;
}

export function mongoIdToAleoField(mongoId: string): string {
  // Remove any non-hex characters
  const cleanHex = mongoId.replace(/[^0-9a-fA-F]/g, '');

  // Convert hex to decimal
  const decimal = new BN(cleanHex, 16);

  // Ensure it's within Aleo's field modulus
  // Aleo's field modulus is roughly 2^251 + something
  const modulus = new BN(
    '8444461749428370424248824938781546531375899335154063827935233455917409239040'
  );
  const fieldValue = decimal.mod(modulus);

  return `${fieldValue.toString()}field`;
}

// Usage
const mongoId = '6618e5dfc4a32b001eaae5b0';
const aleoInput = [mongoIdToAleoField(mongoId), '1u64'];
/**
 * Converts a MongoDB ObjectId to an Aleo u64 format using a chunk-based approach
 * @param objectId - The MongoDB ObjectId as a string
 * @returns The Aleo u64 representation as a string
 */
function mongoIdToAleoU64(objectId: string): string {
  // Validate the input is a valid MongoDB ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(objectId)) {
    throw new Error('Invalid MongoDB ObjectId format');
  }

  // Method 1: Use the timestamp portion (first 8 chars) which is guaranteed to be a valid number
  // MongoDB ObjectId starts with a 4-byte timestamp
  const timestampHex: string = objectId.substring(0, 8);
  const timestamp: number = parseInt(timestampHex, 16);
  
  // Method 2: Process the ObjectId in smaller chunks to avoid BigInt conversion issues
  // Split the remaining part into 4-byte chunks
  const chunk1: number = parseInt(objectId.substring(8, 16), 16);
  const chunk2: number = parseInt(objectId.substring(16, 24), 16);
  
  // Combine the chunks using XOR and addition to create a unique number
  // This avoids BigInt conversion issues while still creating a deterministic value
  let result: number = timestamp;
  result = (result * 16777216) + chunk1; // 16777216 = 2^24
  result = result ^ chunk2; // XOR with the last chunk
  
  // Ensure the result is positive and within u64 range
  result = Math.abs(result) % Number.MAX_SAFE_INTEGER;
  
  // Format for Aleo - u64 values in Aleo are typically represented as decimal
  return `${result.toString()}u64`;
}

/**
 * Converts a MongoDB ObjectId to an Aleo u64 format using a hash-based approach
 * @param objectId - The MongoDB ObjectId as a string
 * @returns The Aleo u64 representation as a string
 */
function mongoIdToAleoU64Hash(objectId: string): string {
  // Validate the input
  if (!/^[0-9a-fA-F]{24}$/.test(objectId)) {
    throw new Error('Invalid MongoDB ObjectId format');
  }
  
  // Simple hash function (djb2)
  let hash: number = 5381;
  for (let i: number = 0; i < objectId.length; i++) {
    // Get char code and convert hex chars to their numeric value
    let charValue: number;
    const char: string = objectId[i].toLowerCase();
    if (char >= '0' && char <= '9') {
      charValue = parseInt(char, 16);
    } else {
      charValue = char.charCodeAt(0);
    }
    
    // djb2 algorithm: hash * 33 + char
    hash = ((hash << 5) + hash) + charValue;
    
    // Keep within safe integer bounds
    hash = hash >>> 0; // Convert to unsigned 32-bit integer
  }
  
  // Ensure it's positive and within safe range
  hash = Math.abs(hash) % Number.MAX_SAFE_INTEGER;
  
  return `${hash.toString()}u64`;
}

// The specific MongoDB ObjectId to convert
const specificObjectId: string = '681aab930f0b994312e685a5';

console.log('Converting specific MongoDB ObjectId to Aleo u64:');
console.log('------------------------------------------------');
console.log(`ObjectId: ${specificObjectId}`);

try {
  // Method 1: Chunk-based approach
  const result1: string = mongoIdToAleoU64(specificObjectId);
  console.log(`Method 1 (Chunk-based): ${result1}`);
  
  // Method 2: Hash-based approach
  const result2: string = mongoIdToAleoU64Hash(specificObjectId);
  console.log(`Method 2 (Hash-based): ${result2}`);
  
  // Extract timestamp information
  const timestampHex: string = specificObjectId.substring(0, 8);
  const timestamp: number = parseInt(timestampHex, 16);
  const date: Date = new Date(timestamp * 1000);
  console.log(`\nTimestamp information:`);
  console.log(`Timestamp hex: ${timestampHex}`);
  console.log(`Timestamp decimal: ${timestamp}`);
  console.log(`Creation date: ${date.toISOString()}`);
  
  // Detailed breakdown of the ObjectId
  console.log(`\nObjectId breakdown:`);
  console.log(`First 8 chars (timestamp): ${specificObjectId.substring(0, 8)}`);
  console.log(`Next 8 chars (machine+pid): ${specificObjectId.substring(8, 16)}`);
  console.log(`Last 8 chars (counter): ${specificObjectId.substring(16, 24)}`);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error('Unknown error occurred');
  }
}

// Export the functions for use in other modules
export { mongoIdToAleoU64, mongoIdToAleoU64Hash };