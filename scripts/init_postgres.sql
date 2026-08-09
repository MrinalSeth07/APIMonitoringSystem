CREATE TABLE IF NOT EXITS endpoint_metrics(
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(24) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    time_bucket TIMESTAMP NOT NULL, -- get,post,patch
    totalhits INTEGER DEFAULT 0,
    errorhits INTEGER DEFAULT 0,
    avg_latency NUMERIC(0,3) DEFAULT 0.000,
    min_latency NUMERIC(0,3) DEFAULT 0.000,
    max_latency NUMERIC(0,3) DEFAULT 0.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRETN_TIMESTAMP,
    UNIQUE(client_id , service_name , endpoint , method , time_bucket), --insert if not present else upsert
);
--TIME BUCKET :- When requesting analytics, metrics, or financial data from an API, a time bucket groups continuous timestamps into discrete blocks.
CREATE INDEX IF NOT EXITS idx_endpoint_metrics_client_id ON endpoint_metrics(client_id);
CREATE INDEX IF NOT EXITS idx_endpoint_metrics_service ON endpoint_metrics(client_id , serivce_name);
CREATE INDEX IF NOT EXITS idx_endpoint_metrics_time ON endpoint_metrics(time_bucket);
CREATE INDEX IF NOT EXITS idx_endpoint_metrics_endpoint ON endpoint_metrics(client_id , service_name , endpoint);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_endpoint_metrics_updated_at ON endpoint_metrics;

CREATE TRIGGER update_endpoint_metrics_updated_at 
BEFORE UPDATE ON endpoint_metrics 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();