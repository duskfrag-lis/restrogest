CREATE TABLE account_deletion_requests (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX one_pending_request_per_user
    ON account_deletion_requests (user_id)
    WHERE status = 'pending';

CREATE INDEX idx_deletion_requests_user_id
    ON account_deletion_requests (user_id);

CREATE INDEX idx_deletion_requests_status ON account_deletion_requests (status);