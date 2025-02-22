
export type ConversationTurnMetrics = {
  convai_llm_service_ttfb?: {
    elapsed_time: number;
  };
  convai_llm_service_ttf_sentence?: {
    elapsed_time: number;
  };
};

export type ConversationTurn = {
  role: "user" | "agent";
  message: string;
  tool_calls: any | null;
  tool_results: any | null;
  feedback: null;
  time_in_call_secs: number;
  conversation_turn_metrics: ConversationTurnMetrics | null;
};

export type ConversationMetadata = {
  start_time_unix_secs: number;
  call_duration_secs: number;
  cost: number;
  deletion_settings: {
    deletion_time_unix_secs: number;
    deleted_logs_at_time_unix_secs: number | null;
    deleted_audio_at_time_unix_secs: number | null;
    deleted_transcript_at_time_unix_secs: number | null;
    delete_transcript_and_pii: boolean;
    delete_audio: boolean;
  };
  feedback: {
    overall_score: number | null;
    likes: number;
    dislikes: number;
  };
  authorization_method: string;
  charging: {
    dev_discount: boolean;
  };
  termination_reason: string;
};

export type DataCollectionResult = {
  data_collection_id: string;
  value: number;
  json_schema: {
    type: string;
    description: string;
    dynamic_variable: string;
  };
  rationale: string;
};

export type ConversationAnalysis = {
  evaluation_criteria_results: Record<string, any>;
  data_collection_results: {
    Leadership?: DataCollectionResult;
    [key: string]: DataCollectionResult | undefined;
  };
  call_successful: "success" | string;
  transcript_summary: string;
};

export type ConversationResponse = {
  agent_id: string;
  conversation_id: string;
  status: "processing" | "done" | "error";
  transcript: ConversationTurn[];
  metadata: ConversationMetadata;
  analysis: ConversationAnalysis | null;
  conversation_initiation_client_data: {
    conversation_config_override: {
      agent: null;
      tts: null;
    };
    custom_llm_extra_body: Record<string, any>;
    dynamic_variables: Record<string, any>;
  };
};
