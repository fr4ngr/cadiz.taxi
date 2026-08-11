"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// functions/api/chat.ts
var chat_exports = {};
__export(chat_exports, {
  onRequestPost: () => onRequestPost
});
module.exports = __toCommonJS(chat_exports);

// node_modules/@google/generative-ai/dist/index.mjs
var SchemaType;
(function(SchemaType2) {
  SchemaType2["STRING"] = "string";
  SchemaType2["NUMBER"] = "number";
  SchemaType2["INTEGER"] = "integer";
  SchemaType2["BOOLEAN"] = "boolean";
  SchemaType2["ARRAY"] = "array";
  SchemaType2["OBJECT"] = "object";
})(SchemaType || (SchemaType = {}));
var ExecutableCodeLanguage;
(function(ExecutableCodeLanguage2) {
  ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
  ExecutableCodeLanguage2["PYTHON"] = "python";
})(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
var Outcome;
(function(Outcome2) {
  Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
  Outcome2["OUTCOME_OK"] = "outcome_ok";
  Outcome2["OUTCOME_FAILED"] = "outcome_failed";
  Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
})(Outcome || (Outcome = {}));
var POSSIBLE_ROLES = ["user", "model", "function", "system"];
var HarmCategory;
(function(HarmCategory2) {
  HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
  HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
  HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
  HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
  HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
  HarmCategory2["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
})(HarmCategory || (HarmCategory = {}));
var HarmBlockThreshold;
(function(HarmBlockThreshold2) {
  HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
  HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
  HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
var HarmProbability;
(function(HarmProbability2) {
  HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
  HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
  HarmProbability2["LOW"] = "LOW";
  HarmProbability2["MEDIUM"] = "MEDIUM";
  HarmProbability2["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
var BlockReason;
(function(BlockReason2) {
  BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
  BlockReason2["SAFETY"] = "SAFETY";
  BlockReason2["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
var FinishReason;
(function(FinishReason2) {
  FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
  FinishReason2["STOP"] = "STOP";
  FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
  FinishReason2["SAFETY"] = "SAFETY";
  FinishReason2["RECITATION"] = "RECITATION";
  FinishReason2["LANGUAGE"] = "LANGUAGE";
  FinishReason2["BLOCKLIST"] = "BLOCKLIST";
  FinishReason2["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
  FinishReason2["SPII"] = "SPII";
  FinishReason2["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
  FinishReason2["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
var TaskType;
(function(TaskType2) {
  TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
  TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
  TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
  TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
  TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
  TaskType2["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));
var FunctionCallingMode;
(function(FunctionCallingMode2) {
  FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  FunctionCallingMode2["AUTO"] = "AUTO";
  FunctionCallingMode2["ANY"] = "ANY";
  FunctionCallingMode2["NONE"] = "NONE";
})(FunctionCallingMode || (FunctionCallingMode = {}));
var DynamicRetrievalMode;
(function(DynamicRetrievalMode2) {
  DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
var GoogleGenerativeAIError = class extends Error {
  constructor(message) {
    super(`[GoogleGenerativeAI Error]: ${message}`);
  }
};
var GoogleGenerativeAIResponseError = class extends GoogleGenerativeAIError {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
};
var GoogleGenerativeAIFetchError = class extends GoogleGenerativeAIError {
  constructor(message, status, statusText, errorDetails) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.errorDetails = errorDetails;
  }
};
var GoogleGenerativeAIRequestInputError = class extends GoogleGenerativeAIError {
};
var GoogleGenerativeAIAbortError = class extends GoogleGenerativeAIError {
};
var DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
var DEFAULT_API_VERSION = "v1beta";
var PACKAGE_VERSION = "0.24.1";
var PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function(Task2) {
  Task2["GENERATE_CONTENT"] = "generateContent";
  Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
  Task2["COUNT_TOKENS"] = "countTokens";
  Task2["EMBED_CONTENT"] = "embedContent";
  Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
var RequestUrl = class {
  constructor(model, task, apiKey, stream, requestOptions) {
    this.model = model;
    this.task = task;
    this.apiKey = apiKey;
    this.stream = stream;
    this.requestOptions = requestOptions;
  }
  toString() {
    var _a, _b;
    const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
    const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
    let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
    if (this.stream) {
      url += "?alt=sse";
    }
    return url;
  }
};
function getClientHeaders(requestOptions) {
  const clientHeaders = [];
  if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
    clientHeaders.push(requestOptions.apiClient);
  }
  clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
  return clientHeaders.join(" ");
}
async function getHeaders(url) {
  var _a;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
  headers.append("x-goog-api-key", url.apiKey);
  let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
  if (customHeaders) {
    if (!(customHeaders instanceof Headers)) {
      try {
        customHeaders = new Headers(customHeaders);
      } catch (e) {
        throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
      }
    }
    for (const [headerName, headerValue] of customHeaders.entries()) {
      if (headerName === "x-goog-api-key") {
        throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
      } else if (headerName === "x-goog-api-client") {
        throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
      }
      headers.append(headerName, headerValue);
    }
  }
  return headers;
}
async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
  const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
  return {
    url: url.toString(),
    fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
  };
}
async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
  const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
  return makeRequest(url, fetchOptions, fetchFn);
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(url, fetchOptions);
  } catch (e) {
    handleResponseError(e, url);
  }
  if (!response.ok) {
    await handleResponseNotOk(response, url);
  }
  return response;
}
function handleResponseError(e, url) {
  let err = e;
  if (err.name === "AbortError") {
    err = new GoogleGenerativeAIAbortError(`Request aborted when fetching ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  } else if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
    err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  }
  throw err;
}
async function handleResponseNotOk(response, url) {
  let message = "";
  let errorDetails;
  try {
    const json = await response.json();
    message = json.error.message;
    if (json.error.details) {
      message += ` ${JSON.stringify(json.error.details)}`;
      errorDetails = json.error.details;
    }
  } catch (e) {
  }
  throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
    const controller = new AbortController();
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      setTimeout(() => controller.abort(), requestOptions.timeout);
    }
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
      requestOptions.signal.addEventListener("abort", () => {
        controller.abort();
      });
    }
    fetchOptions.signal = controller.signal;
  }
  return fetchOptions;
}
function addHelpers(response) {
  response.text = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getText(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return "";
  };
  response.functionCall = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
      return getFunctionCalls(response)[0];
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  response.functionCalls = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getFunctionCalls(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  return response;
}
function getText(response) {
  var _a, _b, _c, _d;
  const textStrings = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.text) {
        textStrings.push(part.text);
      }
      if (part.executableCode) {
        textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
      }
      if (part.codeExecutionResult) {
        textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
      }
    }
  }
  if (textStrings.length > 0) {
    return textStrings.join("");
  } else {
    return "";
  }
}
function getFunctionCalls(response) {
  var _a, _b, _c, _d;
  const functionCalls = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    return functionCalls;
  } else {
    return void 0;
  }
}
var badFinishReasons = [
  FinishReason.RECITATION,
  FinishReason.SAFETY,
  FinishReason.LANGUAGE
];
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  var _a, _b, _c;
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
var responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function processStream(response) {
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  const responseStream = getResponseStream(inputStream);
  const [stream1, stream2] = responseStream.tee();
  return {
    stream: generateResponseSequence(stream1),
    response: getResponsePromise(stream2)
  };
}
async function getResponsePromise(stream) {
  const allResponses = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return addHelpers(aggregateResponses(allResponses));
    }
    allResponses.push(value);
  }
}
function generateResponseSequence(stream) {
  return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
    const reader = stream.getReader();
    while (true) {
      const { value, done } = yield __await(reader.read());
      if (done) {
        break;
      }
      yield yield __await(addHelpers(value));
    }
  });
}
function getResponseStream(inputStream) {
  const reader = inputStream.getReader();
  const stream = new ReadableStream({
    start(controller) {
      let currentText = "";
      return pump();
      function pump() {
        return reader.read().then(({ value, done }) => {
          if (done) {
            if (currentText.trim()) {
              controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
              return;
            }
            controller.close();
            return;
          }
          currentText += value;
          let match = currentText.match(responseLineRE);
          let parsedResponse;
          while (match) {
            try {
              parsedResponse = JSON.parse(match[1]);
            } catch (e) {
              controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
              return;
            }
            controller.enqueue(parsedResponse);
            currentText = currentText.substring(match[0].length);
            match = currentText.match(responseLineRE);
          }
          return pump();
        }).catch((e) => {
          let err = e;
          err.stack = e.stack;
          if (err.name === "AbortError") {
            err = new GoogleGenerativeAIAbortError("Request aborted when reading from the stream");
          } else {
            err = new GoogleGenerativeAIError("Error reading from the stream");
          }
          throw err;
        });
      }
    }
  });
  return stream;
}
function aggregateResponses(responses) {
  const lastResponse = responses[responses.length - 1];
  const aggregatedResponse = {
    promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
  };
  for (const response of responses) {
    if (response.candidates) {
      let candidateIndex = 0;
      for (const candidate of response.candidates) {
        if (!aggregatedResponse.candidates) {
          aggregatedResponse.candidates = [];
        }
        if (!aggregatedResponse.candidates[candidateIndex]) {
          aggregatedResponse.candidates[candidateIndex] = {
            index: candidateIndex
          };
        }
        aggregatedResponse.candidates[candidateIndex].citationMetadata = candidate.citationMetadata;
        aggregatedResponse.candidates[candidateIndex].groundingMetadata = candidate.groundingMetadata;
        aggregatedResponse.candidates[candidateIndex].finishReason = candidate.finishReason;
        aggregatedResponse.candidates[candidateIndex].finishMessage = candidate.finishMessage;
        aggregatedResponse.candidates[candidateIndex].safetyRatings = candidate.safetyRatings;
        if (candidate.content && candidate.content.parts) {
          if (!aggregatedResponse.candidates[candidateIndex].content) {
            aggregatedResponse.candidates[candidateIndex].content = {
              role: candidate.content.role || "user",
              parts: []
            };
          }
          const newPart = {};
          for (const part of candidate.content.parts) {
            if (part.text) {
              newPart.text = part.text;
            }
            if (part.functionCall) {
              newPart.functionCall = part.functionCall;
            }
            if (part.executableCode) {
              newPart.executableCode = part.executableCode;
            }
            if (part.codeExecutionResult) {
              newPart.codeExecutionResult = part.codeExecutionResult;
            }
            if (Object.keys(newPart).length === 0) {
              newPart.text = "";
            }
            aggregatedResponse.candidates[candidateIndex].content.parts.push(newPart);
          }
        }
      }
      candidateIndex++;
    }
    if (response.usageMetadata) {
      aggregatedResponse.usageMetadata = response.usageMetadata;
    }
  }
  return aggregatedResponse;
}
async function generateContentStream(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.STREAM_GENERATE_CONTENT,
    apiKey,
    /* stream */
    true,
    JSON.stringify(params),
    requestOptions
  );
  return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.GENERATE_CONTENT,
    apiKey,
    /* stream */
    false,
    JSON.stringify(params),
    requestOptions
  );
  const responseJson = await response.json();
  const enhancedResponse = addHelpers(responseJson);
  return {
    response: enhancedResponse
  };
}
function formatSystemInstruction(input) {
  if (input == null) {
    return void 0;
  } else if (typeof input === "string") {
    return { role: "system", parts: [{ text: input }] };
  } else if (input.text) {
    return { role: "system", parts: [input] };
  } else if (input.parts) {
    if (!input.role) {
      return { role: "system", parts: input.parts };
    } else {
      return input;
    }
  }
}
function formatNewContent(request) {
  let newParts = [];
  if (typeof request === "string") {
    newParts = [{ text: request }];
  } else {
    for (const partOrString of request) {
      if (typeof partOrString === "string") {
        newParts.push({ text: partOrString });
      } else {
        newParts.push(partOrString);
      }
    }
  }
  return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
  const userContent = { role: "user", parts: [] };
  const functionContent = { role: "function", parts: [] };
  let hasUserContent = false;
  let hasFunctionContent = false;
  for (const part of parts) {
    if ("functionResponse" in part) {
      functionContent.parts.push(part);
      hasFunctionContent = true;
    } else {
      userContent.parts.push(part);
      hasUserContent = true;
    }
  }
  if (hasUserContent && hasFunctionContent) {
    throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  }
  if (!hasUserContent && !hasFunctionContent) {
    throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
  }
  if (hasUserContent) {
    return userContent;
  }
  return functionContent;
}
function formatCountTokensInput(params, modelParams) {
  var _a;
  let formattedGenerateContentRequest = {
    model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
    generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
    safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
    tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
    toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
    systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
    cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
    contents: []
  };
  const containsGenerateContentRequest = params.generateContentRequest != null;
  if (params.contents) {
    if (containsGenerateContentRequest) {
      throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    }
    formattedGenerateContentRequest.contents = params.contents;
  } else if (containsGenerateContentRequest) {
    formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
  } else {
    const content = formatNewContent(params);
    formattedGenerateContentRequest.contents = [content];
  }
  return { generateContentRequest: formattedGenerateContentRequest };
}
function formatGenerateContentInput(params) {
  let formattedRequest;
  if (params.contents) {
    formattedRequest = params;
  } else {
    const content = formatNewContent(params);
    formattedRequest = { contents: [content] };
  }
  if (params.systemInstruction) {
    formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
  }
  return formattedRequest;
}
function formatEmbedContentInput(params) {
  if (typeof params === "string" || Array.isArray(params)) {
    const content = formatNewContent(params);
    return { content };
  }
  return params;
}
var VALID_PART_FIELDS = [
  "text",
  "inlineData",
  "functionCall",
  "functionResponse",
  "executableCode",
  "codeExecutionResult"
];
var VALID_PARTS_PER_ROLE = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
function validateChatHistory(history) {
  let prevContent = false;
  for (const currContent of history) {
    const { role, parts } = currContent;
    if (!prevContent && role !== "user") {
      throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
    }
    if (!POSSIBLE_ROLES.includes(role)) {
      throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
    }
    if (!Array.isArray(parts)) {
      throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
    }
    if (parts.length === 0) {
      throw new GoogleGenerativeAIError("Each Content should have at least one part");
    }
    const countFields = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (const part of parts) {
      for (const key of VALID_PART_FIELDS) {
        if (key in part) {
          countFields[key] += 1;
        }
      }
    }
    const validParts = VALID_PARTS_PER_ROLE[role];
    for (const key of VALID_PART_FIELDS) {
      if (!validParts.includes(key) && countFields[key] > 0) {
        throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
      }
    }
    prevContent = true;
  }
}
function isValidResponse(response) {
  var _a;
  if (response.candidates === void 0 || response.candidates.length === 0) {
    return false;
  }
  const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
  if (content === void 0) {
    return false;
  }
  if (content.parts === void 0 || content.parts.length === 0) {
    return false;
  }
  for (const part of content.parts) {
    if (part === void 0 || Object.keys(part).length === 0) {
      return false;
    }
    if (part.text !== void 0 && part.text === "") {
      return false;
    }
  }
  return true;
}
var SILENT_ERROR = "SILENT_ERROR";
var ChatSession = class {
  constructor(apiKey, model, params, _requestOptions = {}) {
    this.model = model;
    this.params = params;
    this._requestOptions = _requestOptions;
    this._history = [];
    this._sendPromise = Promise.resolve();
    this._apiKey = apiKey;
    if (params === null || params === void 0 ? void 0 : params.history) {
      validateChatHistory(params.history);
      this._history = params.history;
    }
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  async getHistory() {
    await this._sendPromise;
    return this._history;
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessage(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    let finalResult;
    this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
      var _a2;
      if (isValidResponse(result.response)) {
        this._history.push(newContent);
        const responseContent = Object.assign({
          parts: [],
          // Response seems to come back without a role set.
          role: "model"
        }, (_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content);
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(result.response);
        if (blockErrorMessage) {
          console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
      finalResult = result;
    }).catch((e) => {
      this._sendPromise = Promise.resolve();
      throw e;
    });
    await this._sendPromise;
    return finalResult;
  }
  /**
   * Sends a chat message and receives the response as a
   * {@link GenerateContentStreamResult} containing an iterable stream
   * and a response promise.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessageStream(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
    this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
      throw new Error(SILENT_ERROR);
    }).then((streamResult) => streamResult.response).then((response) => {
      if (isValidResponse(response)) {
        this._history.push(newContent);
        const responseContent = Object.assign({}, response.candidates[0].content);
        if (!responseContent.role) {
          responseContent.role = "model";
        }
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(response);
        if (blockErrorMessage) {
          console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
    }).catch((e) => {
      if (e.message !== SILENT_ERROR) {
        console.error(e);
      }
    });
    return streamPromise;
  }
};
async function countTokens(apiKey, model, params, singleRequestOptions) {
  const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
  return response.json();
}
async function embedContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
  return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
  const requestsWithModel = params.requests.map((request) => {
    return Object.assign(Object.assign({}, request), { model });
  });
  const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
  return response.json();
}
var GenerativeModel = class {
  constructor(apiKey, modelParams, _requestOptions = {}) {
    this.apiKey = apiKey;
    this._requestOptions = _requestOptions;
    if (modelParams.model.includes("/")) {
      this.model = modelParams.model;
    } else {
      this.model = `models/${modelParams.model}`;
    }
    this.generationConfig = modelParams.generationConfig || {};
    this.safetySettings = modelParams.safetySettings || [];
    this.tools = modelParams.tools;
    this.toolConfig = modelParams.toolConfig;
    this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
    this.cachedContent = modelParams.cachedContent;
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContent(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
  }
  /**
   * Makes a single streaming call to the model and returns an object
   * containing an iterable stream that iterates over all chunks in the
   * streaming response as well as a promise that returns the final
   * aggregated response.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContentStream(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(startChatParams) {
    var _a;
    return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, startChatParams), this._requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async countTokens(request, requestOptions = {}) {
    const formattedParams = formatCountTokensInput(request, {
      model: this.model,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction,
      cachedContent: this.cachedContent
    });
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds the provided content.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async embedContent(request, requestOptions = {}) {
    const formattedParams = formatEmbedContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds an array of {@link EmbedContentRequest}s.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
  }
};
var GoogleGenerativeAI = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  /**
   * Gets a {@link GenerativeModel} instance for the provided model name.
   */
  getGenerativeModel(modelParams, requestOptions) {
    if (!modelParams.model) {
      throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
    }
    return new GenerativeModel(this.apiKey, modelParams, requestOptions);
  }
  /**
   * Creates a {@link GenerativeModel} instance from provided content cache.
   */
  getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
    if (!cachedContent.name) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
    }
    if (!cachedContent.model) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
    }
    const disallowedDuplicates = ["model", "systemInstruction"];
    for (const key of disallowedDuplicates) {
      if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
        if (key === "model") {
          const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
          const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
          if (modelParamsComp === cachedContentComp) {
            continue;
          }
        }
        throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
      }
    }
    const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
    return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
  }
};

// functions/api/compiled-brains.js
var systemPromptA = '> [!NOTE]\r\n> **Leyes aplicadas desde:** 6/7/2026, 20:40:48\r\n\r\nEres el Asistente Virtual Oficial de C\xE1diz ciudad y provincia. Tienes una personalidad servicial, profesional y muy experta.\r\n\r\nSabes distinguir a la perfecci\xF3n si una pregunta es sobre una urgencia que requiera dar la info necesaria o el contacto necesario.\r\n\r\nTu misi\xF3n se divide en estas reglas inquebrantables:\r\n\r\n### REGLA 1: El Experto Local (Conocimiento Abierto)\r\nTienes permiso para usar tu inmenso conocimiento sobre C\xE1diz. Responde a turistas y ciudadanos sobre localidades, playas, monumentos, restaurantes, fiestas, historia o servicios, dentistas de urgencia, todo lo que pueda necesitar un usuario.\r\n*Directriz:* Retenci\xF3n absoluta. JAM\xC1S mandes al usuario a buscar a Google, Google Maps u otra p\xE1gina externa. T\xFA eres su Google. Si tienes que darle ubicaciones, d\xE1selas directamente. Integraci\xF3n total siempre que sea contenido oficial y p\xFAblico.\r\n\r\n### REGLA 2: Las 8 Plantillas Maestras (UI Templates)\r\nTu sistema est\xE1 conectado a un motor de UI con 8 plantillas. ERES OBLIGADO a elegir la mejor plantilla (`cardType`) para la intenci\xF3n del usuario y proveer los datos (badge, title, etc.).\r\n- **`HeroCard`**: Para lugares espectaculares (Monumentos, Iglesias, Historia, Playas). Requiere `imageUrl`, `badge` (ej. "\u{1F3DB}\uFE0F Historia", "\u{1F30A} Playa"), `title` y `subtitle`.\r\n- **`ListCard`**: Para enumerar cosas (Rutas, Top 10, Fin de semana). Requiere `listItems` (array con `title`, `subtitle`).\r\n- **`BusinessCard`**: Para negocios (Restaurantes, Alojamientos, Tiendas). Requiere `contactName`, `phoneNumber`, `website`.\r\n- **`ArticleCard`**: Para informaci\xF3n extensa, normativa, historia pura o noticias. \r\n- **`ProductCard`**: Para ofertas, souvenirs, tarifas. Requiere `imageUrl`, `title`, `price`.\r\n- **`ProfileCard`**: Para profesionales, gu\xEDas. Requiere `imageUrl` (foto perfil), `contactName`.\r\n- **`AlertCard`**: Para emergencias o clima severo. Requiere `title`, `badge` (ej. "\u26A0\uFE0F Alerta").\r\n- **`GalleryCard`**: Si te piden *espec\xEDficamente* ver m\xE1s fotos de un lugar y tienes un array de `imageUrls`.\r\n- **`MapCard` / `NavigationCard`**: Si te piden c\xF3mo llegar a un sitio, usa estas tarjetas con `lat` y `lon`.\r\n- **`TransportCard`**: Si el usuario pide transporte (autob\xFAs/catamar\xE1n), usa la herramienta `get_transport_schedule`. Devuelve esta tarjeta obligatoriamente con el objeto `transportData` estructurado as\xED: `{"routes": [{"mode": "bus" o "boat", "origin": "nombre origen", "destination": "nombre destino", "nextDeparture": "HH:MM", "upcomingDepartures": ["HH:MM", "HH:MM"]}]}`.\r\n- **`ElectricityCard`**: EXCLUSIVO para mostrar los precios de la luz. El sistema inyectar\xE1 los datos autom\xE1ticamente, solo devuelve el cardType. IMPORTANTE: En tu respuesta de texto que acompa\xF1a a esta tarjeta, explica SIEMPRE s\xFAper brevemente (1 o 2 l\xEDneas) qu\xE9 es la tarifa PVPC regulada, menciona la existencia del Bono Social para familias vulnerables, y recuerda que al precio del consumo de la gr\xE1fica hay que sumarle los costes fijos de potencia contratada e impuestos.\r\nADICIONALMENTE: Escribe SIEMPRE en p\xE1rrafos muy cortos (m\xE1ximo 2-3 l\xEDneas). Usa negritas. Est\xE1 TERMINANTEMENTE PROHIBIDO escribir muros de texto.\r\n\r\n### REGLA 3: La Ley Inquebrantable (Cerebro A)\r\nSi el usuario pregunta algo relacionado con normativas, tarifas, o informaci\xF3n oficial de la que te hemos prove\xEDdo documentos (Cerebro A), el Cerebro A es la Palabra de Dios. \r\n*Directriz:* Puedes complementar la respuesta con tu amabilidad, pero jam\xE1s puedes contradecir o inventar una tarifa o norma que no coincida exactamente con los textos oficiales proporcionados por los cerebros A.\r\n\r\n### REGLA 4: El Embudo de Ventas "Bisagra" (Cerebro B)\r\nTu verdadero objetivo oculto es generar conversiones (reservas, clics, ventas).\r\n*Directriz:* Despu\xE9s de responder a la pregunta del usuario de forma \xFAtil, debes actuar como una "visagra conversacional" natural. Busca siempre la excusa l\xF3gica y sutil para ofrecerle un servicio de nuestros recursos del Cerebro B. Nunca presiones, solo recomienda el servicio oportuno en el momento adecuado.\r\n\r\n### REGLA 5: Transporte Fuera del Consorcio Metropolitano\r\nSi el usuario te pregunta por l\xEDneas o rutas de autob\xFAs que NO pertenezcan al Consorcio de la Bah\xEDa de C\xE1diz o del Campo de Gibraltar (por ejemplo, autobuses de media distancia a Sevilla, M\xE1laga, C\xF3rdoba, Madrid, o rutas internas de la Sierra de C\xE1diz como Ubrique, Grazalema, Villamart\xEDn, Algodonales, etc.):\r\n1. Explica brevemente que esta ruta est\xE1 fuera de la red metropolitana integrada que manejas en tiempo real.\r\n2. Usa tu conocimiento interno o tu capacidad de razonamiento para proveer informaci\xF3n real y \xFAtil sobre los operadores que cubren esa ruta (por ejemplo, TG Comes para la Sierra de C\xE1diz, Damas para Sevilla/Huelva, Socibus para Madrid).\r\n3. Proporciona enlaces a sus p\xE1ginas web oficiales (ej. `tgcomes.es`, `damas-sa.es`, `socibus.es`) y recomi\xE9ndale al usuario consultar directamente en ellas para asegurar los horarios vigentes.\r\n{{CEREBROS_INJECTION_POINT}}';
var systemPromptB = "> [!NOTE]\r\n> **Leyes aplicadas desde:** 6/7/2026, 20:40:48\r\n\r\nEres un experto en sugerir playas de cadiz\r\n\r\n### REGLA 1: Nueva Regla";
var abConfig = {
  "active": true,
  "trafficA": 50
};

// functions/api/chat.ts
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}
async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;
    const sessionId = body.sessionId || "anonymous";
    const userCity = body.city || null;
    const userProfile = body.userProfile || "desconocido";
    let activeVariant = "A";
    let activeSystemPrompt = systemPromptA;
    if (abConfig && abConfig.active) {
      const hashVal = hashCode(sessionId) % 100;
      if (hashVal >= abConfig.trafficA) {
        activeVariant = "B";
        activeSystemPrompt = systemPromptB || systemPromptA;
      }
    }
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing key. Available env keys: " + Object.keys(env).join(", ") }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    let cerebrosXml = "";
    let cerebrosFiltrados = [];
    try {
      const aiEmbedding = await env.AI.run("@cf/baai/bge-large-en-v1.5", { text: [userMessage] });
      const vector = aiEmbedding.data[0];
      const vecMatches = await env.VECTORIZE_INDEX.query(vector, { topK: 3 });
      if (vecMatches && vecMatches.matches && vecMatches.matches.length > 0) {
        const matchIds = vecMatches.matches.map((m) => m.id);
        const placeholders = matchIds.map(() => "?").join(",");
        const query = `SELECT * FROM knowledge_base WHERE id IN (${placeholders})`;
        const dbResults = await env.DB.prepare(query).bind(...matchIds).all();
        if (dbResults && dbResults.results) {
          cerebrosFiltrados = dbResults.results;
          cerebrosXml = cerebrosFiltrados.map((b) => `
<cerebro materia="${b.materia}" tipo="${b.tipo}" documento="${b.id}">
${b.content}
</cerebro>
`).join("");
        }
      }
    } catch (ragError) {
      console.error("Error en RAG Vectorize:", ragError);
    }
    const userCityContext = userCity ? `<contexto_usuario>
El usuario ha configurado expl\xEDcitamente su ciudad actual como: ${userCity}. Prioriza y orienta tus recomendaciones a esta ciudad si es relevante.
</contexto_usuario>
` : "";
    const systemInstruction = (activeSystemPrompt || "Eres un asistente.").replace("{{CEREBROS_INJECTION_POINT}}", `<cerebros_activos>
${cerebrosXml}
</cerebros_activos>
${userCityContext}`);
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        cardType: {
          type: SchemaType.STRING,
          enum: ["TextCard", "MapCard", "NavigationCard", "GalleryCard", "HeroCard", "ListCard", "BusinessCard", "ArticleCard", "AlertCard", "ProductCard", "ProfileCard", "ElectricityCard"],
          description: "El tipo de tarjeta visual a mostrar."
        },
        content: {
          type: SchemaType.STRING,
          description: "Mensaje principal del asistente."
        },
        badge: { type: SchemaType.STRING, description: "Etiqueta superior (ej. '\u{1F3DB}\uFE0F Historia', '\u26A0\uFE0F Alerta')." },
        title: { type: SchemaType.STRING, description: "T\xEDtulo principal de la tarjeta." },
        subtitle: { type: SchemaType.STRING, description: "Subt\xEDtulo o texto secundario corto." },
        imageUrl: { type: SchemaType.STRING, description: "URL de una imagen principal (para HeroCard, ProductCard, ProfileCard)." },
        imageUrls: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Lista de URLs de im\xE1genes (para GalleryCard)." },
        listItems: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              subtitle: { type: SchemaType.STRING },
              icon: { type: SchemaType.STRING }
            },
            required: ["title"]
          },
          description: "Elementos de una lista (para ListCard)."
        },
        lat: { type: SchemaType.STRING, description: "Latitud exacta (MapCard, NavigationCard)." },
        lon: { type: SchemaType.STRING, description: "Longitud exacta (MapCard, NavigationCard)." },
        locationTitle: { type: SchemaType.STRING, description: "Nombre del lugar (MapCard, NavigationCard)." },
        price: { type: SchemaType.STRING, description: "Precio actual (ProductCard, BusinessCard)." },
        oldPrice: { type: SchemaType.STRING, description: "Precio anterior tachado (ProductCard)." },
        contactName: { type: SchemaType.STRING, description: "Nombre del contacto (BusinessCard, ProfileCard)." },
        phoneNumber: { type: SchemaType.STRING, description: "Tel\xE9fono (BusinessCard, ProfileCard)." },
        whatsappNumber: { type: SchemaType.STRING, description: "WhatsApp (BusinessCard, ProfileCard)." },
        email: { type: SchemaType.STRING, description: "Email (BusinessCard, ProfileCard)." },
        website: { type: SchemaType.STRING, description: "URL de la p\xE1gina web (BusinessCard)." },
        buttonText: { type: SchemaType.STRING, description: "Texto del bot\xF3n principal." },
        buttonAction: { type: SchemaType.STRING, description: "Comando o prompt interno a enviar cuando se hace clic en el bot\xF3n." },
        intentCategory: {
          type: SchemaType.STRING,
          description: "Categor\xEDa de la intenci\xF3n del usuario. OBLIGATORIO.",
          enum: ["Gastronomia", "Transporte y movilidad", "Alojamiento", "Clima", "Playas", "Zonas verdes", "Bah\xEDa", "Deporte", "Belleza", "Eventos-Agenda", "Compras", "Kids", "Mascotas", "Caravana", "Inclusivo", "Love", "Social-Sostenible", "Iglesias", "Catedral", "La Caleta", "Historia", "Arte", "Crucerista", "Flamencos", "Ocio", "Otros"]
        },
        suggestedBlocks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING
          },
          description: "1 a 3 bloques sugeridos para guiar al usuario hacia la conversi\xF3n."
        }
      },
      required: ["cardType", "content", "suggestedBlocks", "intentCategory"]
    };
    let finalSystemPrompt = systemInstruction;
    if (userProfile && userProfile !== "desconocido") {
      finalSystemPrompt += `

<GADITAN_PROFILE>
El usuario actual se ha identificado como: **${userProfile.toUpperCase()}**.
Adapta tus respuestas, recomendaciones y tono a este perfil. Por ejemplo, si es Turista recomi\xE9ndale b\xE1sicos; si es Gaditano, cosas locales o avanzadas; si es Negocio, facil\xEDtale opciones profesionales.
</GADITAN_PROFILE>`;
    }
    const today = /* @__PURE__ */ new Date();
    const dateString = today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Madrid" });
    finalSystemPrompt += `

<FECHA_ACTUAL>
Hoy es ${dateString}. Usa esta fecha EXACTA como referencia absoluta para responder preguntas sobre "hoy", "ma\xF1ana" o eventos pr\xF3ximos.
</FECHA_ACTUAL>`;
    const clientContext = body.clientContext || null;
    if (clientContext) {
      let contextStr = `

<HIPERSEGMENTACION_CONTEXTO>
`;
      contextStr += `INFORMACION OBTENIDA IMPLICITAMENTE DEL DISPOSITIVO DEL USUARIO (NO REQUIERE COOKIES):
`;
      if (clientContext.geo) {
        contextStr += `- Ubicaci\xF3n detectada (IP): ${clientContext.geo.city || "Desconocida"}, ${clientContext.geo.region || ""}, ${clientContext.geo.country || ""}
`;
        contextStr += `- Zona horaria: ${clientContext.geo.timezone || "Desconocida"}
`;
        contextStr += `- Proveedor (ASN): ${clientContext.geo.asn || "Desconocido"}
`;
      }
      if (clientContext.userAgent) {
        const ua = (clientContext.userAgent || "").toLowerCase();
        const device = ua.includes("mobile") ? "M\xF3vil" : "Escritorio";
        const os = ua.includes("iphone") || ua.includes("mac") ? "Apple/iOS" : ua.includes("windows") ? "Windows" : ua.includes("android") ? "Android" : "Otro";
        contextStr += `- Dispositivo: ${device} (${os})
`;
      }
      if (clientContext.browser) {
        const b = clientContext.browser;
        contextStr += `- Idioma del navegador: ${b.language || "desconocido"} (todos: ${b.languages || b.language})
`;
        contextStr += `- Pantalla: ${b.screenWidth}x${b.screenHeight} (densidad: ${b.devicePixelRatio}x)
`;
        contextStr += `- T\xE1ctil: ${b.touchScreen ? "S\xED (m\xF3vil/tablet)" : "No (rat\xF3n/trackpad)"}
`;
        contextStr += `- Modo oscuro: ${b.darkMode ? "S\xED" : "No"}
`;
        if (b.connection) {
          contextStr += `- Conexi\xF3n: ${b.connection.type || "?"} (${b.connection.downlink || "?"} Mbps)
`;
        }
        contextStr += `- Lleg\xF3 desde: ${b.referrer || "directo (escribi\xF3 la URL)"}
`;
        contextStr += `- Hora local del usuario: ${b.localHour}:00 (${b.localDay})
`;
      }
      contextStr += `
INSTRUCCIONES DE HIPERSEGMENTACI\xD3N:
- Usa estos datos DISCRETAMENTE para personalizar tus respuestas desde el PRIMER mensaje.
- Si el idioma del navegador NO es espa\xF1ol, saluda en su idioma y ofr\xE9cete a hablar en ese idioma.
- Si la hora local es de ma\xF1ana (6-12), saluda con "Buenos d\xEDas". Si es tarde (12-20), "Buenas tardes". Si es noche (20-6), "Buenas noches".
- Si el usuario est\xE1 en una ciudad de la provincia de C\xE1diz, menci\xF3nala sutilmente en tu saludo (ej: "desde ${clientContext.geo?.city || "ah\xED"}").
- Si viene desde un buscador (Google), asume que busca informaci\xF3n tur\xEDstica.
- Si est\xE1 en m\xF3vil con pantalla t\xE1ctil, prioriza respuestas cortas y accionables.
- NUNCA reveles que tienes estos datos ni menciones "hipersegmentaci\xF3n" o "fingerprint".
</HIPERSEGMENTACION_CONTEXTO>`;
      finalSystemPrompt += contextStr;
    }
    let apiHistory = [];
    if (finalSystemPrompt) {
      apiHistory.push({ role: "user", parts: [{ text: finalSystemPrompt }] });
      apiHistory.push({ role: "model", parts: [{ text: "Entendido. Actuar\xE9 seg\xFAn las directrices y el esquema JSON establecido, considerando el perfil del usuario." }] });
    }
    let historyContents = body.history && body.history.length > 0 ? body.history : [{ role: "user", parts: [{ text: userMessage }] }];
    historyContents = [...apiHistory, ...historyContents];
    const inputType = body.inputType || "typed";
    const beachTool = {
      functionDeclarations: [{
        name: "get_beach_conditions",
        description: "Llama a esta funci\xF3n EXCLUSIVAMENTE cuando el usuario te pregunte expl\xEDcitamente por el clima, el tiempo o el estado de las PLAYAS (ej. 'c\xF3mo est\xE1 la playa', 'hace d\xEDa de playa en la caleta', 'estado de las olas'). Devuelve datos reales de AEMET (temperatura del agua, oleaje, viento, sensaci\xF3n t\xE9rmica). NO la llames para saludos gen\xE9ricos.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            beach_id: {
              type: SchemaType.STRING,
              description: "El ID de la playa a consultar. Usa '1101201' si preguntan por La Caleta. Usa '1101203' si preguntan por La Victoria, Cortadura, Santa Maria del Mar, o por las playas de C\xE1diz en general."
            }
          },
          required: ["beach_id"]
        }
      }]
    };
    const transportTool = {
      functionDeclarations: [{
        name: "get_transport_schedule",
        description: "Llama a esta funci\xF3n EXCLUSIVAMENTE cuando el usuario pregunte por horarios, pr\xF3ximas salidas o tiempos de espera de transporte p\xFAblico metropolitano desde o hacia C\xE1diz o el Campo de Gibraltar (ej. 'cu\xE1ndo sale el catamar\xE1n', 'autob\xFAs a San Fernando', 'bus a Chiclana', 'horario al cementerio mancomunado', 'autobus de Tarifa', 'bus de Algeciras'). Devuelve las pr\xF3ximas salidas reales del Consorcio de Transportes.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            route: {
              type: SchemaType.STRING,
              description: "La ruta solicitada. Debe ser uno de los siguientes valores exactos: 'catamaran_puerto', 'catamaran_rota', 'bus_sanfernando', 'bus_chiclana', 'bus_puertoreal', 'bus_cementerio_ida', 'bus_cementerio_vuelta', 'bus_algeciras', 'bus_lalinea', 'bus_tarifa'."
            }
          },
          required: ["route"]
        }
      }]
    };
    const newsTool = {
      functionDeclarations: [{
        name: "get_latest_news",
        description: "Llama a esta funci\xF3n cuando el usuario pregunte por noticias recientes, actualidad o qu\xE9 ha pasado hoy. IMPORTANTE: Si el usuario pregunta por una zona amplia (ej. 'Sierra de C\xE1diz', 'Campo de Gibraltar', 'Costa') o un pueblo espec\xEDfico, deja 'municipio' como 'all' y FILTRA T\xDA MISMO las noticias en tu respuesta final bas\xE1ndote en la zona pedida.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            municipio: {
              type: SchemaType.STRING,
              description: "Filtra las noticias por municipio exacto de C\xE1diz (ej. 'C\xE1diz', 'Jerez de la Frontera', 'Chiclana de la Frontera'). Si el usuario pide una comarca (ej. Sierra), un pueblo sin secci\xF3n propia, o toda la provincia, usa 'all'."
            },
            categoria: {
              type: SchemaType.STRING,
              description: "Filtra por categor\xEDa si el usuario pide algo espec\xEDfico (ej. 'deporte', 'cultura', 'sucesos', 'politica', 'economia', 'salud'). Si no, usa 'all'."
            }
          }
        }
      }]
    };
    const eventsTool = {
      functionDeclarations: [{
        name: "get_official_events",
        description: "Llama a esta funci\xF3n SIEMPRE que el usuario pregunte por la agenda cultural, eventos, exposiciones, actividades, talleres o planes en cualquier lugar de la provincia (incluyendo pueblos espec\xEDficos, la 'Sierra de C\xE1diz', la 'Bah\xEDa', etc.). Pide siempre la provincia completa y luego T\xDA filtra los resultados en tu respuesta bas\xE1ndote en la zona que pidi\xF3 el usuario. Devuelve eventos activos o futuros.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            provincia: {
              type: SchemaType.STRING,
              description: "Provincia a consultar, por defecto 'C\xE1diz'."
            }
          }
        }
      }]
    };
    const gasTool = {
      functionDeclarations: [{
        name: "get_gas_prices",
        description: "Llama a esta funci\xF3n EXCLUSIVAMENTE cuando el usuario pregunte por precios de gasolina, di\xE9sel, gasolineras baratas o d\xF3nde repostar combustible en la provincia. Devuelve el Top 5 de las gasolineras m\xE1s baratas para ese combustible en la localidad.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            municipio: {
              type: SchemaType.STRING,
              description: "Municipio exacto de C\xE1diz (ej. 'Jerez de la Frontera', 'C\xE1diz', 'Chiclana de la Frontera', 'San Fernando', 'El Puerto de Santa Mar\xEDa', 'Algeciras'). Si el usuario pide toda la provincia, usa 'all'."
            },
            tipo_combustible: {
              type: SchemaType.STRING,
              description: "Tipo de combustible a buscar. Valores permitidos: 'Gasolina 95 E5', 'Gasolina 98 E5', 'Gasoleo A', 'Gasoleo Premium', 'Gases licuados del petr\xF3leo'. Por defecto usa 'Gasolina 95 E5' si no se especifica."
            }
          },
          required: ["municipio", "tipo_combustible"]
        }
      }]
    };
    const electricityTool = {
      functionDeclarations: [{
        name: "get_electricity_prices",
        description: "Llama a esta funci\xF3n cuando el usuario pregunte por el precio de la luz de hoy, a qu\xE9 hora es m\xE1s barata o m\xE1s cara, o por los tramos horarios (PVPC). No necesita par\xE1metros.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            dummy: {
              type: SchemaType.STRING,
              description: "Par\xE1metro vac\xEDo."
            }
          }
        }
      }]
    };
    let responseText = "";
    let currentModel = "gemini-2.5-flash";
    let latencyMs = 0;
    let tokensUsed = 0;
    const startTime = Date.now();
    const msgLower = userMessage.toLowerCase().trim();
    const transportKeywords = ["bus", "autob\xFAs", "autobuses", "catamaran", "catamar\xE1n", "barco", "barquito", "horario", "salidas", "l\xEDneas", "lineas", "tren", "renfe", "cercan", "trambahia", "trambah\xEDa"];
    const isTransportQuery = transportKeywords.some((kw) => msgLower.includes(kw));
    const routingKeywords = ["como ir", "c\xF3mo ir", "ruta", "alternativa", "como voy", "c\xF3mo voy", "como llegar", "c\xF3mo llegar", "llevame", "ll\xE9vame", "quiero ir", "me gustaria ir", "me gustar\xEDa ir", "viajar a", "desplazarme a", "llegar a", "voy a", "ir para", "ir a", "ir de", "ir desde"];
    const isRoutingQuery = routingKeywords.some((kw) => msgLower.includes(kw));
    const beachKeywords = ["playa", "caleta", "victoria", "cortadura", "santa mar\xEDa", "oleaje", "olas"];
    const isBeachQuery = beachKeywords.some((kw) => msgLower.includes(kw));
    if (isTransportQuery || isRoutingQuery || isBeachQuery) {
      try {
        if (isTransportQuery || isRoutingQuery) {
          const towns = [
            { name: "C\xE1diz", keywords: ["c\xE1diz", "cadiz"], busId: 14, consorcioId: 2, trainName: "c\xE1diz" },
            { name: "Aeropuerto de Jerez", keywords: ["aeropuerto de jerez", "aeropuerto"], busId: null, consorcioId: 2, trainName: "aeropuerto de jerez" },
            { name: "Jerez", keywords: ["jerez"], busId: 161, consorcioId: 2, trainName: "jerez de la frontera" },
            { name: "San Fernando", keywords: ["san fernando", "la isla"], busId: 47, consorcioId: 2, trainName: "san fernando-bah\xEDa sur" },
            { name: "El Puerto de Santa Mar\xEDa", keywords: ["puerto de santa mar\xEDa", "el puerto", "pto de sta maria", "pto de santa maria"], busId: 125, consorcioId: 2, trainName: "puerto de santa mar\xEDa" },
            { name: "Puerto Real", keywords: ["puerto real"], busId: 86, consorcioId: 2, trainName: "puerto real" },
            { name: "Chiclana", keywords: ["chiclana"], busId: 272, consorcioId: 2, trainName: "pelagatos" },
            { name: "Rota", keywords: ["rota"], busId: 181, consorcioId: 2, trainName: null },
            { name: "Conil", keywords: ["conil"], busId: 296, consorcioId: 2, trainName: null },
            { name: "Medina", keywords: ["medina", "medina sidonia"], busId: 188, consorcioId: 2, trainName: null },
            { name: "Algeciras", keywords: ["algeciras"], busId: 1, consorcioId: 5, trainName: null },
            { name: "La L\xEDnea", keywords: ["la l\xEDnea", "linea de la concepci\xF3n", "la linea"], busId: 116, consorcioId: 5, trainName: null },
            { name: "Tarifa", keywords: ["tarifa"], busId: 143, consorcioId: 5, trainName: null }
          ];
          let originTown = towns[0];
          let destTown = null;
          const originRegex = /(?:desde|de|salgo de)\s+([a-záéíóúñ\s]+?)(?:\s+(?:a|hacia|para)\s+|$)/i;
          const matchOrigin = msgLower.match(originRegex);
          if (matchOrigin) {
            const originStr = matchOrigin[1];
            const found = towns.find((t) => t.keywords.some((k) => originStr.includes(k)));
            if (found) originTown = found;
          }
          const destRegex = /(?:a|al|hacia|para)\s+([a-záéíóúñ\s]+)/i;
          const matchDest = msgLower.match(destRegex);
          if (matchDest) {
            const destStr = matchDest[1];
            const found = towns.find((t) => t.keywords.some((k) => destStr.includes(k)));
            if (found && found.name !== originTown.name) destTown = found;
          }
          if (!destTown) {
            const found = towns.find((t) => t.keywords.some((k) => msgLower.includes(k)) && t.name !== originTown.name);
            if (found) destTown = found;
          }
          const destinationsToSearch = [];
          if (destTown && originTown.busId !== null) {
            destinationsToSearch.push({
              route: `bus_${originTown.name}_${destTown.name}`,
              idParada: originTown.busId,
              consorcioId: originTown.consorcioId,
              originName: originTown.name,
              targetDestino: destTown.name === "El Puerto de Santa Mar\xEDa" ? "El Puerto" : destTown.name,
              name: `\u{1F68C} Autob\xFAs a ${destTown.name}`
            });
          }
          if (originTown.name === "C\xE1diz" && destTown?.name === "Rota") destinationsToSearch.push({ route: "catamaran_rota", idParada: 193, consorcioId: 2, targetDestino: "Rota", name: "\u{1F6A2} Catamar\xE1n a Rota" });
          if (originTown.name === "C\xE1diz" && destTown?.name === "El Puerto de Santa Mar\xEDa") destinationsToSearch.push({ route: "catamaran_puerto", idParada: 193, consorcioId: 2, targetDestino: "El Puerto", name: "\u{1F6A2} Catamar\xE1n a El Puerto" });
          const transportRoutes = [];
          if (isRoutingQuery || msgLower.includes("tren") || msgLower.includes("renfe") || msgLower.includes("cercan") || msgLower.includes("trambahia") || msgLower.includes("trambah\xEDa")) {
            let originStr = originTown.trainName;
            let destStr = destTown ? destTown.trainName : null;
            if (env.ASSETS) {
              try {
                const renfeReq = new Request(new URL("/data/renfe_cadiz.json", request.url));
                const renfeRes = await env.ASSETS.fetch(renfeReq);
                if (renfeRes.ok) {
                  const renfeData = await renfeRes.json();
                  let originId, destId;
                  let originName = originStr, destName = destStr;
                  if (originStr && destStr) {
                    for (const [id, stop] of Object.entries(renfeData.stops)) {
                      if (stop.name && stop.name.toLowerCase() === (originStr || "").toLowerCase()) {
                        originId = id;
                        originName = stop.name;
                      }
                      if (stop.name && stop.name.toLowerCase() === (destStr || "").toLowerCase()) {
                        destId = id;
                        destName = stop.name;
                      }
                    }
                  }
                  if (originId && destId) {
                    let allDayTrips = [];
                    const formatter = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false });
                    const nowStr = formatter.format(/* @__PURE__ */ new Date());
                    const madridDate = new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
                    const dayOfWeek = madridDate.getDay() === 0 ? 6 : madridDate.getDay() - 1;
                    const nowStrDate = `${madridDate.getFullYear()}${(madridDate.getMonth() + 1).toString().padStart(2, "0")}${madridDate.getDate().toString().padStart(2, "0")}`;
                    for (const trip of renfeData.trips) {
                      const cal = renfeData.calendar[trip.s];
                      if (cal && cal.days[dayOfWeek] === 1 && cal.start <= nowStrDate && cal.end >= nowStrDate) {
                        const oIdx = trip.st.findIndex((s) => s[0] === originId);
                        const dIdx = trip.st.findIndex((s) => s[0] === destId);
                        if (oIdx !== -1 && dIdx !== -1 && oIdx < dIdx) {
                          const time = trip.st[oIdx][1];
                          allDayTrips.push({ time, trip, oIdx, dIdx });
                        }
                      }
                    }
                    const uniqueTripsMap = /* @__PURE__ */ new Map();
                    for (const t of allDayTrips) {
                      if (!uniqueTripsMap.has(t.time)) uniqueTripsMap.set(t.time, t);
                    }
                    allDayTrips = Array.from(uniqueTripsMap.values()).sort((a, b) => a.time.localeCompare(b.time));
                    const rtRes = await fetch("https://gtfsrt.renfe.com/trip_updates.json", { signal: AbortSignal.timeout(3e3) }).catch(() => null);
                    let rtData = null;
                    if (rtRes && rtRes.ok) rtData = await rtRes.json();
                    let upcoming = allDayTrips.filter((t) => t.time >= nowStr);
                    let nextDeparture = null, nextDelay = null, nextStatus = null;
                    const upcomingDepartures = [];
                    for (let i = 0; i < Math.min(upcoming.length, 4); i++) {
                      const u = upcoming[i];
                      let delay = null;
                      let status = "on_time";
                      if (rtData && rtData.entity) {
                        const rtEntity = rtData.entity.find((e) => e.id === "TUUPDATE_" + u.trip.t);
                        if (rtEntity && rtEntity.tripUpdate) {
                          if (rtEntity.tripUpdate.trip && rtEntity.tripUpdate.trip.scheduleRelationship === "CANCELED") status = "canceled";
                          if (rtEntity.tripUpdate.delay) {
                            delay = Math.round(rtEntity.tripUpdate.delay / 60);
                            if (delay > 0) status = "delayed";
                          }
                        }
                      }
                      if (i === 0) {
                        nextDeparture = u.time;
                        nextDelay = delay;
                        nextStatus = status;
                      } else {
                        upcomingDepartures.push(u.time);
                      }
                    }
                    if (nextDeparture || allDayTrips.length > 0) {
                      const referenceTrip = upcoming.length > 0 ? upcoming[0] : allDayTrips[0];
                      let lineCode = "Cercan\xEDas C-1";
                      if (referenceTrip) {
                        const route = renfeData.routes[referenceTrip.trip.r];
                        if (route && route.short_name) {
                          lineCode = route.short_name;
                        }
                      }
                      const stops = [];
                      if (referenceTrip) {
                        for (let i = referenceTrip.oIdx; i <= referenceTrip.dIdx; i++) {
                          const stopId = referenceTrip.trip.st[i][0];
                          const stopInfo = renfeData.stops[stopId];
                          if (stopInfo) {
                            stops.push({
                              name: stopInfo.name,
                              isOrigin: i === referenceTrip.oIdx,
                              isDest: i === referenceTrip.dIdx
                            });
                          }
                        }
                      }
                      const schedules = allDayTrips.map((t) => {
                        let lc = "C-1";
                        const rt = renfeData.routes[t.trip.r];
                        if (rt && rt.short_name) {
                          lc = rt.short_name === "Cercan\xEDas C-1" ? "C-1" : rt.short_name;
                        }
                        return {
                          time: t.time,
                          isPast: t.time < nowStr,
                          lineCode: lc
                        };
                      });
                      transportRoutes.push({
                        mode: "train",
                        origin: originName,
                        destination: destName,
                        nextDeparture,
                        upcomingDepartures,
                        delay: nextDelay,
                        status: nextStatus,
                        details: { lineCode, stops, schedules }
                      });
                    }
                  }
                }
              } catch (e) {
                console.error("Error cargando Renfe:", e);
              }
            }
          }
          if (destinationsToSearch.length > 0) {
            for (const item of destinationsToSearch) {
              const today2 = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(/* @__PURE__ */ new Date());
              const cacheKey = `transport_${item.consorcioId}_${item.idParada}_${today2}`;
              const cacheResult = await env.DB.prepare("SELECT value, updated_at FROM system_cache WHERE key = ?").bind(cacheKey).first();
              let servicios = [];
              let shouldFetch = true;
              if (cacheResult && cacheResult.value) {
                servicios = JSON.parse(cacheResult.value);
                const updatedTime = (/* @__PURE__ */ new Date(cacheResult.updated_at + "Z")).getTime();
                if (Date.now() - updatedTime < 6e4) {
                  shouldFetch = false;
                }
              }
              if (shouldFetch) {
                const fetchPromise = fetch(`http://api.ctan.es/v1/Consorcios/${item.consorcioId}/paradas/${item.idParada}/servicios`, { signal: AbortSignal.timeout(4e3) }).then((res) => res.ok ? res.json() : null).then((json) => {
                  if (json && json.servicios) {
                    const newServicios = json.servicios;
                    const merged = [...servicios];
                    for (const s of newServicios) {
                      if (!merged.find((m) => m.idLinea === s.idLinea && m.servicio === s.servicio && m.destino === s.destino)) {
                        merged.push(s);
                      }
                    }
                    merged.sort((a, b) => a.servicio.localeCompare(b.servicio));
                    return env.DB.prepare(`
                                                INSERT INTO system_cache (key, value) VALUES (?, ?)
                                                ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                                            `).bind(cacheKey, JSON.stringify(merged)).run();
                  }
                }).catch((e) => console.error("Error fetching consorcio", e));
                if (servicios.length === 0) {
                  await fetchPromise;
                  const newCache = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind(cacheKey).first();
                  if (newCache && newCache.value) servicios = JSON.parse(newCache.value);
                } else {
                  context.waitUntil(fetchPromise);
                }
              }
              if (servicios) {
                const formatter = new Intl.DateTimeFormat("es-ES", {
                  timeZone: "Europe/Madrid",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                });
                const nowMadrid = formatter.format(/* @__PURE__ */ new Date()).trim();
                let filteredServicios = servicios;
                if (item.targetDestino) {
                  filteredServicios = servicios.filter((s) => s.destino && s.destino.toLowerCase().includes((item.targetDestino || "").toLowerCase()));
                }
                let upcoming = filteredServicios.filter((s) => s.servicio && s.servicio >= nowMadrid);
                const nextDeparture = upcoming.length > 0 ? upcoming[0].servicio : null;
                const upcomingDepartures = upcoming.slice(1, 4).map((s) => s.servicio);
                const originName = item.originName || (item.idParada === 300 || item.idParada === 14 ? "C\xE1diz" : item.idParada === 193 ? "C\xE1diz (Terminal)" : item.idParada === 1 ? "Algeciras" : `Parada ${item.idParada}`);
                let lineCode = item.route.startsWith("catamaran") ? "Catamar\xE1n" : "Autob\xFAs";
                let stops = [];
                let schedules = [];
                if (filteredServicios.length > 0) {
                  lineCode = filteredServicios[0].linea || lineCode;
                  const idLinea = filteredServicios[0].idLinea;
                  const sentido = filteredServicios[0].sentido;
                  if (idLinea && sentido) {
                    const stopsCacheKey = `stops_${item.consorcioId}_${idLinea}_${sentido}`;
                    const stopsCache = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind(stopsCacheKey).first();
                    if (stopsCache && stopsCache.value) {
                      stops = JSON.parse(stopsCache.value);
                    } else {
                      const stopsRes = await fetch(`http://api.ctan.es/v1/Consorcios/${item.consorcioId}/lineas/${idLinea}/paradas`).catch(() => null);
                      if (stopsRes && stopsRes.ok) {
                        const stopsJson = await stopsRes.json();
                        if (stopsJson && stopsJson.paradas) {
                          const lineStops = stopsJson.paradas.filter((p) => p.sentido === sentido).sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
                          const originIdx = lineStops.findIndex((p) => p.idParada === item.idParada.toString() || p.idParada === item.idParada);
                          const sliced = originIdx !== -1 ? lineStops.slice(originIdx) : lineStops;
                          stops = sliced.map((p, idx) => ({
                            name: p.nombre,
                            isOrigin: idx === 0,
                            isDest: idx === sliced.length - 1
                          }));
                          context.waitUntil(env.DB.prepare("INSERT INTO system_cache (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(stopsCacheKey, JSON.stringify(stops)).run());
                        }
                      }
                    }
                  }
                  schedules = filteredServicios.map((s) => ({
                    time: s.servicio,
                    isPast: s.servicio < nowMadrid
                  }));
                }
                transportRoutes.push({
                  mode: item.route.startsWith("catamaran") ? "boat" : "bus",
                  origin: originName,
                  destination: item.targetDestino,
                  nextDeparture,
                  upcomingDepartures,
                  details: { lineCode, stops, schedules }
                });
              }
            }
          }
          if (transportRoutes.length > 0) {
            let finalCardType = isRoutingQuery ? "RouteCard" : "TransportCard";
            let finalContent = `He consultado los horarios en tiempo real. Aqu\xED tienes las pr\xF3ximas salidas disponibles:`;
            let parsedData2 = {
              cardType: finalCardType,
              content: finalContent,
              intentCategory: "Transporte y movilidad",
              suggestedBlocks: ["\xBFQu\xE9 tiempo hace en La Caleta?", "Ver paradas en el mapa", "\xBFC\xF3mo ir a San Fernando?"]
            };
            if (isRoutingQuery) {
              const options = transportRoutes.map((tr) => ({
                mode: tr.mode,
                durationText: tr.mode === "train" ? "40 min" : "50 min",
                // Approx
                durationValue: tr.mode === "train" ? 2400 : 3e3,
                nextDeparture: tr.nextDeparture,
                price: tr.mode === "train" ? "4.10\u20AC" : "2.50\u20AC",
                details: tr.details
              }));
              const target = transportRoutes[0].destination;
              if (env.GOOGLE_MAPS_API_KEY) {
                const originStr = `${originTown.name}, C\xE1diz, Spain`;
                const destStr = `${destTown ? destTown.name : target}, C\xE1diz, Spain`;
                try {
                  const googleRes = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
                      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                    },
                    body: JSON.stringify({
                      origin: { address: originStr },
                      destination: { address: destStr },
                      travelMode: "DRIVE",
                      routingPreference: "TRAFFIC_AWARE",
                      computeAlternativeRoutes: false
                    })
                  });
                  if (googleRes.ok) {
                    const googleData = await googleRes.json();
                    if (googleData.routes && googleData.routes.length > 0) {
                      const route = googleData.routes[0];
                      const durSecs = parseInt(route.duration.replace("s", ""));
                      const distKm = (route.distanceMeters / 1e3).toFixed(1);
                      options.push({
                        mode: "car",
                        durationText: `${Math.round(durSecs / 60)} min`,
                        durationValue: durSecs,
                        distanceText: `${distKm} km`,
                        trafficCondition: durSecs > 3e3 ? "heavy" : durSecs > 2100 ? "moderate" : "good"
                      });
                    }
                  }
                } catch (e) {
                  console.error("Error fetching Google Maps:", e);
                }
              }
              parsedData2.routeData = {
                origin: originTown.name,
                destination: target,
                options
              };
              parsedData2.content = `Aqu\xED tienes una comparativa de las mejores alternativas para ir a ${target} en tiempo real:`;
            } else {
              parsedData2.transportData = { routes: transportRoutes };
            }
            if (env.DB) {
              context.waitUntil(env.DB.prepare(
                "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
              ).bind(userMessage, parsedData2.content, "Transporte y movilidad", Date.now() - startTime, 0, "Fast-Path Local", "typed", activeVariant).run().catch(console.error));
            }
            return new Response(JSON.stringify(parsedData2), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
        } else if (isBeachQuery) {
          let beachId = "1101203";
          if (msgLower.includes("caleta")) beachId = "1101201";
          const cacheKey = `beach_${beachId}`;
          const cacheResult = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind(cacheKey).first();
          if (cacheResult && cacheResult.value) {
            const data = JSON.parse(cacheResult.value);
            const parsedData2 = {
              cardType: "TextCard",
              badge: "\u{1F30A} Clima de Playas",
              title: `Estado de la Playa: ${data.nombre}`,
              content: `Aqu\xED tienes las condiciones actuales en **${data.nombre}**:

\u2022 **Cielo:** ${data.estadoCielo || "N/A"}
\u2022 **Viento:** ${data.viento || "N/A"}
\u2022 **Oleaje:** ${data.oleaje || "N/A"}
\u2022 **Temp. Agua:** ${data.temperaturaAgua || "N/A"}
\u2022 **Sensaci\xF3n:** ${data.sensacionTermica || "N/A"}
\u2022 **\xCDndice UV:** ${data.uvMax || "N/A"}

*Fuente: AEMET (Cach\xE9 R\xE1pida D1)*`,
              intentCategory: "Playas",
              suggestedBlocks: ["Horario bus a San Fernando", "Qu\xE9 ver en C\xE1diz"]
            };
            if (env.DB) {
              context.waitUntil(env.DB.prepare(
                "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
              ).bind(userMessage, parsedData2.content, "Playas", Date.now() - startTime, 0, "Fast-Path Local", "typed", activeVariant).run().catch(console.error));
            }
            return new Response(JSON.stringify(parsedData2), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
        }
      } catch (fastPathErr) {
        console.error("Fallo en enrutador r\xE1pido (Fast-Path):", fastPathErr);
      }
    }
    try {
      let model = genAI.getGenerativeModel({
        model: currentModel,
        generationConfig: {
          temperature: 0.1
        },
        tools: [beachTool, transportTool, newsTool, eventsTool, gasTool, electricityTool]
      });
      let response = await model.generateContent({
        contents: historyContents
      });
      if (response.response.functionCalls() && response.response.functionCalls().length > 0) {
        const call = response.response.functionCalls()[0];
        let toolResponseData = { error: "No se pudo obtener datos" };
        let toolCalled = true;
        if (call.name === "get_beach_conditions") {
          const beachId = call.args.beach_id || "1101203";
          try {
            const cacheResult = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind(`beach_${beachId}`).first();
            if (cacheResult && cacheResult.value) {
              toolResponseData = JSON.parse(cacheResult.value);
              toolResponseData.fuente = "Cach\xE9 R\xE1pida (Cerebro B)";
            } else {
              const playaRes = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/${beachId}/?api_key=${env.AEMET_API_KEY}`);
              const playaJson = await playaRes.json();
              if (playaJson.estado == 200 && playaJson.datos) {
                const dataRes = await fetch(playaJson.datos);
                const dataArr = await dataRes.json();
                if (dataArr && dataArr[0] && dataArr[0].prediccion && dataArr[0].prediccion.dia) {
                  const todayData = dataArr[0].prediccion.dia[0];
                  toolResponseData = {
                    nombre: dataArr[0].nombre,
                    estadoCielo: todayData.estadoCielo ? todayData.estadoCielo.descripcion1 : "N/A",
                    viento: todayData.viento ? todayData.viento.descripcion1 : "N/A",
                    oleaje: todayData.oleaje ? todayData.oleaje.descripcion1 : "N/A",
                    temperaturaAgua: todayData.tAgua ? `${todayData.tAgua.valor1}\xBAC` : "N/A",
                    sensacionTermica: todayData.sTermica ? todayData.sTermica.descripcion1 : "N/A",
                    uvMax: todayData.uvMax ? todayData.uvMax.valor1 : "N/A",
                    fuente: "AEMET en vivo"
                  };
                }
              }
            }
          } catch (e) {
            console.error("AEMET Cache/API error:", e);
          }
        } else if (call.name === "get_transport_schedule") {
          const route = call.args.route;
          let idParada = null;
          let consorcioId = 2;
          let targetDestino = null;
          if (route === "catamaran_puerto") {
            idParada = 193;
            targetDestino = "El Puerto";
          } else if (route === "catamaran_rota") {
            idParada = 193;
            targetDestino = "Rota";
          } else if (route === "bus_sanfernando") {
            idParada = 300;
            targetDestino = "San Fernando";
          } else if (route === "bus_chiclana") {
            idParada = 300;
            targetDestino = "Chiclana";
          } else if (route === "bus_puertoreal") {
            idParada = 300;
            targetDestino = "Puerto Real";
          } else if (route === "bus_cementerio_ida") {
            idParada = 300;
            targetDestino = "Cementerio";
          } else if (route === "bus_cementerio_vuelta") {
            idParada = 56;
            targetDestino = "C\xE1diz";
          } else if (route === "bus_algeciras") {
            idParada = 1;
            consorcioId = 5;
            targetDestino = "Algeciras";
          } else if (route === "bus_lalinea") {
            idParada = 116;
            consorcioId = 5;
            targetDestino = "La L\xEDnea";
          } else if (route === "bus_tarifa") {
            idParada = 143;
            consorcioId = 5;
            targetDestino = "Tarifa";
          }
          if (idParada) {
            try {
              const cacheKey = `transport_${consorcioId}_${idParada}`;
              const cacheResult = await env.DB.prepare("SELECT value, updated_at FROM system_cache WHERE key = ?").bind(cacheKey).first();
              let servicios = null;
              let needsRevalidate = false;
              if (cacheResult && cacheResult.value) {
                servicios = JSON.parse(cacheResult.value);
                const updatedAt = new Date(cacheResult.updated_at).getTime();
                if (Date.now() - updatedAt > 10 * 60 * 1e3) {
                  needsRevalidate = true;
                }
              } else {
                needsRevalidate = true;
              }
              const revalidate = async () => {
                try {
                  const res = await fetch(`http://api.ctan.es/v1/Consorcios/${consorcioId}/paradas/${idParada}/servicios`, { signal: AbortSignal.timeout(5e3) });
                  if (res.ok) {
                    const json = await res.json();
                    if (json && json.servicios) {
                      const upsertQuery = `
                                                INSERT INTO system_cache (key, value) 
                                                VALUES (?, ?)
                                                ON CONFLICT(key) DO UPDATE SET 
                                                    value = excluded.value, 
                                                    updated_at = CURRENT_TIMESTAMP;
                                            `;
                      await env.DB.prepare(upsertQuery).bind(cacheKey, JSON.stringify(json.servicios)).run();
                      return json.servicios;
                    }
                  }
                } catch (err) {
                  console.error("Error revalidando transportes en background:", err);
                }
                return null;
              };
              if (needsRevalidate) {
                if (servicios) {
                  context.waitUntil(revalidate());
                } else {
                  servicios = await revalidate();
                }
              }
              if (servicios) {
                const formatter = new Intl.DateTimeFormat("es-ES", {
                  timeZone: "Europe/Madrid",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                });
                const nowMadrid = formatter.format(/* @__PURE__ */ new Date()).trim();
                let upcoming = servicios.filter((s) => s.servicio && s.servicio >= nowMadrid);
                if (targetDestino) {
                  upcoming = upcoming.filter((s) => s.destino && s.destino.toLowerCase().includes((targetDestino || "").toLowerCase()));
                }
                toolResponseData = {
                  ruta_solicitada: route,
                  parada_origen: servicios[0] ? servicios[0].nombreParada || `Parada ${idParada}` : "Desconocida",
                  proximas_salidas: upcoming.slice(0, 3).map((s) => ({
                    hora: s.servicio,
                    linea: s.linea,
                    destino: s.destino,
                    nombre_ruta: s.nombre
                  })),
                  fuente: needsRevalidate && !cacheResult ? "Consorcio de Transportes (Live)" : "Consorcio de Transportes (Cach\xE9 D1)"
                };
              }
            } catch (e) {
              console.error("CTAN API error:", e);
            }
          }
        } else if (call.name === "get_latest_news") {
          const municipio = call.args.municipio || "all";
          const categoria = call.args.categoria || "all";
          try {
            const cacheResult = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind("news_cadiz_v9").first();
            if (cacheResult && cacheResult.value) {
              const data = JSON.parse(cacheResult.value);
              let items = data.items || [];
              if (municipio !== "all") items = items.filter((i) => i.municipio === municipio);
              if (categoria !== "all") items = items.filter((i) => i.categoria === categoria);
              toolResponseData = {
                resumen_noticias: items.slice(0, 15).map((i) => `[${i.fuente}] ${i.titulo} (${i.hace})`).join("\n"),
                total_encontradas: items.length,
                aviso: "Responde de forma conversacional destacando lo m\xE1s importante. Ofrece m\xE1s detalles si el usuario lo pide."
              };
            } else {
              toolResponseData = { error: "Las noticias a\xFAn no se han sincronizado en cach\xE9." };
            }
          } catch (e) {
            console.error("Error obteniendo noticias para IA:", e);
          }
        } else if (call.name === "get_official_events") {
          const provincia = call.args.provincia || "C\xE1diz";
          try {
            const url = new URL(request.url);
            const eventsRes = await fetch(`${url.protocol}//${url.host}/api/events?provincia=${encodeURIComponent(provincia)}`);
            if (eventsRes.ok) {
              toolResponseData = await eventsRes.json();
              try {
                const cacheResult = await env.DB.prepare("SELECT value FROM system_cache WHERE key = ?").bind("news_cadiz_v9").first();
                if (cacheResult && cacheResult.value) {
                  const data = JSON.parse(cacheResult.value);
                  let items = data.items || [];
                  const keywords = ["concierto", "festival", "actuaci\xF3n", "actuacion", "teatro", "agenda", "exposici\xF3n", "exposicion", "entradas", "cartel", "musical"];
                  const newsEvents = items.filter((i) => {
                    const text = (i.titulo + " " + (i.descripcion || "")).toLowerCase();
                    return keywords.some((kw) => text.includes(kw));
                  });
                  if (newsEvents.length > 0) {
                    toolResponseData.eventos_en_prensa = newsEvents.slice(0, 15).map((i) => `[${i.fuente}] ${i.titulo}`);
                    toolResponseData.instruccion_extra = "OBLIGATORIO: Enumera de forma EXPL\xCDCITA y EXACTA los eventos mencionados en 'eventos_en_prensa'. NO hagas res\xFAmenes gen\xE9ricos (ej. no digas 'hay m\xE1s conciertos y ferias'). Tienes que dar los nombres exactos de los eventos que aparecen en la lista.";
                  }
                }
              } catch (err) {
                console.error("Error inyectando prensa en eventos:", err);
              }
            } else {
              toolResponseData = { error: "No se pudo obtener la agenda de eventos." };
            }
          } catch (e) {
            console.error("Error obteniendo eventos:", e);
          }
        } else if (call.name === "get_gas_prices") {
          const municipioStr = call.args.municipio || "all";
          const tipoGas = call.args.tipo_combustible || "Gasolina 95 E5";
          try {
            const mitecoUrl = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/11";
            const gasRes = await fetch(mitecoUrl, { cf: { cacheTtl: 3600 } });
            if (gasRes.ok) {
              const data = await gasRes.json();
              const estaciones = data.ListaEESSPrecio || [];
              const keyMap = {
                "Gasolina 95 E5": "Precio Gasolina 95 E5",
                "Gasolina 98 E5": "Precio Gasolina 98 E5",
                "Gasoleo A": "Precio Gasoleo A",
                "Gasoleo Premium": "Precio Gasoleo Premium",
                "Gases licuados del petr\xF3leo": "Precio Gases licuados del petr\xF3leo"
              };
              const priceKey = keyMap[tipoGas] || "Precio Gasolina 95 E5";
              let filtradas = estaciones.filter((e) => e[priceKey] && e[priceKey].trim() !== "");
              if (municipioStr.toLowerCase() !== "all") {
                const normalizeStr = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
                const munBuscado = normalizeStr(municipioStr);
                filtradas = filtradas.filter((e) => normalizeStr(e.Municipio).includes(munBuscado) || normalizeStr(e.Localidad).includes(munBuscado));
              }
              filtradas.sort((a, b) => {
                const pa = parseFloat(a[priceKey].replace(",", "."));
                const pb = parseFloat(b[priceKey].replace(",", "."));
                return pa - pb;
              });
              const top5 = filtradas.slice(0, 5).map((e) => ({
                rotulo: e["R\xF3tulo"],
                direccion: e["Direcci\xF3n"],
                localidad: e["Localidad"],
                precio: e[priceKey] + " \u20AC",
                horario: e["Horario"]
              }));
              toolResponseData = {
                combustible_consultado: tipoGas,
                municipio_consultado: municipioStr,
                resultados: top5.length > 0 ? top5 : "No se encontraron gasolineras con precios reportados para este combustible en esta zona."
              };
            } else {
              toolResponseData = { error: "El servicio del Ministerio de Transici\xF3n Ecol\xF3gica no est\xE1 disponible temporalmente." };
            }
          } catch (e) {
            console.error("Error obteniendo gasolineras:", e);
            toolResponseData = { error: "Error interno al procesar los datos de gasolineras." };
          }
        } else if (call.name === "get_electricity_prices") {
          try {
            const { hoursData, percentChange } = await fetchElectricityWithHistory();
            if (hoursData) {
              context.electricityHoursData = hoursData;
              if (percentChange !== null) {
                context.historicalComparison = { percentChange };
              }
              let sunsetDataStr = "";
              try {
                let weatherData = null;
                const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key LIKE 'weather_v8_%' LIMIT 1`).first();
                if (row) {
                  weatherData = JSON.parse(row.value);
                } else {
                  const weatherUrl = new URL("/api/weather?city=C\xE1diz", request.url);
                  const wRes = await fetch(weatherUrl.toString());
                  if (wRes.ok) weatherData = await wRes.json();
                }
                if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
                  const tf = weatherData.forecast[0];
                  if (tf.orto && tf.ocaso) {
                    context.sunsetData = { sunrise: tf.orto, sunset: tf.ocaso };
                    sunsetDataStr = ` Hoy amanece a las ${tf.orto} y anochece a las ${tf.ocaso}. Puedes usar este dato para aconsejar cu\xE1ndo aprovechar la luz solar.`;
                  }
                }
              } catch (e) {
                console.error("Error sunsetData tool:", e);
              }
              toolResponseData = {
                info: "Datos obtenidos con \xE9xito. Usa cardType 'ElectricityCard' y el sistema inyectar\xE1 los datos autom\xE1ticamente." + sunsetDataStr + " IMPORTANTE: En tu respuesta de texto (content), explica s\xFAper brevemente qu\xE9 es la tarifa PVPC, menciona que existe el Bono Social, y recuerda que al consumo hay que sumarle la potencia contratada y los impuestos.",
                status: "OK"
              };
            } else {
              toolResponseData = { error: "No se encontraron datos de PVPC." };
            }
          } catch (e) {
            console.error("Error obteniendo luz:", e);
            toolResponseData = { error: "Error interno al consultar la luz." };
          }
        } else {
          toolCalled = false;
        }
        if (toolCalled) {
          historyContents.push({
            role: "model",
            parts: response.response.candidates[0].content.parts
          });
          historyContents.push({
            role: "function",
            parts: [{
              functionResponse: {
                name: call.name,
                response: toolResponseData
              }
            }]
          });
          historyContents.push({
            role: "user",
            parts: [{ text: 'Ahora responde al usuario usando los datos de la herramienta. Tu respuesta DEBE ser un \xFAnico objeto JSON v\xE1lido. NO a\xF1adas texto fuera del JSON, ni saltos de l\xEDnea al principio. Sigue ESTRICTAMENTE esta estructura de ejemplo:\n{"cardType":"ListCard","content":"Respuesta aqu\xED...","intentCategory":"Eventos-Agenda","listItems":[{"title":"...","subtitle":"..."}],"suggestedBlocks":["..."]}' }]
          });
          model = genAI.getGenerativeModel({
            model: currentModel,
            generationConfig: {
              temperature: 0.1
            }
          });
          response = await model.generateContent({
            contents: historyContents
          });
        }
      }
      responseText = response.response.text();
      latencyMs = Date.now() - startTime;
      if (response.response.usageMetadata) {
        tokensUsed = response.response.usageMetadata.totalTokenCount || 0;
      }
    } catch (error) {
      console.error("Error with model:", error);
      let fallbackMsg = "Ha ocurrido un error de conexi\xF3n con mi cerebro. Por favor, int\xE9ntalo de nuevo en unos segundos.";
      if (error.message && error.message.includes("524")) {
        fallbackMsg = "\xA1Uf! La conexi\xF3n ha tardado demasiado y se ha agotado el tiempo de espera. \xBFPodr\xEDas repet\xEDrmelo?";
      } else if (error.message && error.message.includes("429")) {
        fallbackMsg = "Estoy hablando con demasiada gente a la vez y me he quedado sin aliento. \xA1Dame 1 minuto!";
      } else if (error.message && error.message.includes("503")) {
        fallbackMsg = "Mis servidores est\xE1n saturados temporalmente. Por favor, int\xE9ntalo de nuevo en unos segundos.";
      } else if (error.message) {
        fallbackMsg = `Error interno: ${error.message}`;
      }
      return new Response(JSON.stringify({ error: fallbackMsg }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    let parsedData;
    try {
      let cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      let startIdx = cleanText.indexOf("{");
      let jsonExtracted = null;
      if (startIdx !== -1) {
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;
        for (let i = startIdx; i < cleanText.length; i++) {
          const char = cleanText[i];
          if (!escapeNext && char === '"') {
            inString = !inString;
          }
          if (char === "\\" && inString) {
            escapeNext = true;
          } else {
            escapeNext = false;
          }
          if (!inString) {
            if (char === "{") braceCount++;
            else if (char === "}") braceCount--;
          }
          if (braceCount === 0 && !inString) {
            try {
              jsonExtracted = JSON.parse(cleanText.substring(startIdx, i + 1));
              break;
            } catch (e) {
            }
          }
        }
      }
      if (jsonExtracted) {
        parsedData = jsonExtracted;
      } else {
        parsedData = JSON.parse(cleanText);
      }
    } catch (e) {
      let fallbackText = responseText.replace(/\{"cardType.*?\}/gs, "").trim();
      if (!fallbackText) fallbackText = "Ha ocurrido un error entendiendo el formato de la respuesta.";
      parsedData = { cardType: "TextCard", content: fallbackText, suggestedBlocks: ["\xBFQu\xE9 m\xE1s puedo ver?"], intentCategory: "Otros" };
    }
    if (parsedData.cardType === "ElectricityCard") {
      if (context.sunsetData) {
        parsedData.sunsetData = context.sunsetData;
      } else {
        try {
          let weatherData = null;
          const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key LIKE 'weather_v8_%' LIMIT 1`).first();
          if (row) {
            weatherData = JSON.parse(row.value);
          } else {
            const weatherUrl = new URL("/api/weather?city=C\xE1diz", request.url);
            const wRes = await fetch(weatherUrl.toString());
            if (wRes.ok) weatherData = await wRes.json();
          }
          if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
            const tf = weatherData.forecast[0];
            if (tf.orto && tf.ocaso) {
              parsedData.sunsetData = { sunrise: tf.orto, sunset: tf.ocaso };
            }
          }
        } catch (e) {
          console.error("Error sunsetData fallback:", e);
        }
      }
      if (context.historicalComparison) {
        parsedData.historicalComparison = context.historicalComparison;
      }
      if (context.electricityHoursData) {
        parsedData.electricityData = JSON.stringify(context.electricityHoursData);
      } else {
        const { hoursData, percentChange } = await fetchElectricityWithHistory();
        if (hoursData) {
          parsedData.electricityData = JSON.stringify(hoursData);
          if (percentChange !== null) {
            parsedData.historicalComparison = { percentChange };
          }
        }
      }
    }
    if (env.DB) {
      context.waitUntil((async () => {
        try {
          const intentCat = parsedData.intentCategory || "Otros";
          const botRespText = parsedData.content || "Sin respuesta";
          const brainsInjected = cerebrosFiltrados.length > 0 ? cerebrosFiltrados.map((b) => b.materia || b.id).join(", ") : "";
          await env.DB.prepare(
            "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(userMessage, botRespText, intentCat, latencyMs, tokensUsed, brainsInjected, inputType, activeVariant).run();
        } catch (dbError) {
          console.error("D1 Insert Error:", dbError);
        }
      })());
    }
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    let errorMessage = "Ha ocurrido un error inesperado.";
    if (error.message && error.message.includes("429")) {
      errorMessage = "\xA1Uf! Estoy hablando con demasiada gente a la vez y me he quedado sin aliento (L\xEDmite de la capa gratuita). Espera 1 minuto e int\xE9ntalo de nuevo.";
    } else if (error.message && error.message.includes("524")) {
      errorMessage = "\xA1Uf! La conexi\xF3n ha tardado demasiado y se ha agotado el tiempo de espera. \xBFPodr\xEDas repet\xEDrmelo?";
    } else if (error.message && error.message.includes("503")) {
      errorMessage = "Mis servidores est\xE1n saturados temporalmente. Por favor, int\xE9ntalo de nuevo en unos segundos.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function fetchElectricityWithHistory() {
  const spainDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(/* @__PURE__ */ new Date());
  const dateObj = /* @__PURE__ */ new Date();
  dateObj.setFullYear(dateObj.getFullYear() - 1);
  const lastYearStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(dateObj);
  const urlToday = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${spainDate}T00:00&end_date=${spainDate}T23:59&time_trunc=hour`;
  const urlLastYear = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${lastYearStr}T00:00&end_date=${lastYearStr}T23:59&time_trunc=hour`;
  let hoursData = null;
  let percentChange = null;
  try {
    const [resToday, resLastYear] = await Promise.all([
      fetch(urlToday, { cf: { cacheTtl: 3600 } }),
      fetch(urlLastYear, { cf: { cacheTtl: 86400 } })
    ]);
    if (resToday.ok) {
      const data = await resToday.json();
      const pvpc = data.included?.find((i) => i.id === "1001");
      if (pvpc?.attributes?.values) {
        hoursData = pvpc.attributes.values.map((v, idx) => {
          const hStr = idx.toString().padStart(2, "0");
          const nextHStr = (idx + 1).toString().padStart(2, "0");
          return { hour: `${hStr}-${nextHStr}`, price: v.value };
        });
        if (resLastYear.ok) {
          const dataLY = await resLastYear.json();
          const pvpcLY = dataLY.included?.find((i) => i.id === "1001");
          if (pvpcLY?.attributes?.values) {
            const sumToday = hoursData.reduce((acc, curr) => acc + curr.price, 0);
            const avgToday = sumToday / hoursData.length;
            const valuesLY = pvpcLY.attributes.values;
            const sumLY = valuesLY.reduce((acc, curr) => acc + curr.value, 0);
            const avgLY = sumLY / valuesLY.length;
            if (avgLY > 0) {
              percentChange = (avgToday - avgLY) / avgLY * 100;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error fetchElectricityWithHistory", e);
  }
  return { hoursData, percentChange };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  onRequestPost
});
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
