-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "pet_species" AS ENUM ('CAT', 'DOG', 'RABBIT', 'TURTLE', 'BIRD');

-- CreateEnum
CREATE TYPE "active_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "element_type" AS ENUM ('BASE', 'CONCEPT', 'BEHAVIOR', 'RISK', 'SCENARIO', 'TOOL', 'DISCOVERY');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');

-- CreateEnum
CREATE TYPE "reality_level" AS ENUM ('GROUNDED', 'SIMPLIFIED_MODEL', 'SCENARIO', 'HYPOTHESIS');

-- CreateEnum
CREATE TYPE "safety_label" AS ENUM ('EDUCATION_ONLY', 'SIMULATION_ONLY', 'NOT_FINANCIAL_ADVICE', 'HIGH_RISK_TOPIC', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "relationship_strength" AS ENUM ('WEAK', 'MODERATE', 'STRONG');

-- CreateEnum
CREATE TYPE "craft_rule_type" AS ENUM ('COMMUTATIVE', 'ORDERED', 'SELF_COMBINE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "discovery_result_status" AS ENUM ('SUCCESS', 'NO_RECIPE', 'BLOCKED', 'ERROR');

-- CreateEnum
CREATE TYPE "workspace_status" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "status" "user_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "species" "pet_species" NOT NULL,
    "avatar_url" TEXT,
    "personality" TEXT,
    "learning_goal" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "active_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "element_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elements" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon_url" TEXT,
    "emoji" TEXT NOT NULL,
    "element_type" "element_type" NOT NULL,
    "is_starter" BOOLEAN NOT NULL DEFAULT false,
    "status" "content_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovery_details" (
    "id" UUID NOT NULL,
    "element_id" UUID NOT NULL,
    "short_description" TEXT NOT NULL,
    "real_lesson" TEXT NOT NULL,
    "example" TEXT,
    "possible_benefit" TEXT,
    "possible_tradeoff" TEXT,
    "hidden_risk" TEXT,
    "works_when" TEXT,
    "becomes_difficult_when" TEXT,
    "what_changes_outcome" TEXT,
    "reality_level" "reality_level" NOT NULL,
    "safety_label" "safety_label" NOT NULL,
    "sources" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "discovery_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_relationships" (
    "id" UUID NOT NULL,
    "source_element_id" UUID NOT NULL,
    "target_element_id" UUID NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "strength" "relationship_strength" NOT NULL,
    "sources" JSONB NOT NULL,
    "status" "active_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "element_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_recipes" (
    "id" UUID NOT NULL,
    "output_element_id" UUID NOT NULL,
    "input_hash" TEXT NOT NULL,
    "rule_type" "craft_rule_type" NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "craft_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_recipe_inputs" (
    "id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "element_id" UUID NOT NULL,
    "input_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "craft_recipe_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_elements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "element_id" UUID NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "unlocked_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_viewed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovery_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "recipe_id" UUID,
    "result_element_id" UUID,
    "input_element_ids" JSONB NOT NULL,
    "result_status" "discovery_result_status" NOT NULL,
    "discovered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discovery_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "workspace_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_nodes" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "element_id" UUID NOT NULL,
    "position_x" DOUBLE PRECISION NOT NULL,
    "position_y" DOUBLE PRECISION NOT NULL,
    "value_data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workspace_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_edges" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "source_node_id" UUID NOT NULL,
    "target_node_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" UUID NOT NULL,
    "linked_element_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "simulation_type" TEXT NOT NULL,
    "status" "active_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_runs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "simulation_id" UUID NOT NULL,
    "inputs" JSONB NOT NULL,
    "outputs" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pets_user_id_key" ON "pets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "element_categories_name_key" ON "element_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "elements_slug_key" ON "elements"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "discovery_details_element_id_key" ON "discovery_details"("element_id");

-- CreateIndex
CREATE INDEX "element_relationships_source_element_id_idx" ON "element_relationships"("source_element_id");

-- CreateIndex
CREATE INDEX "element_relationships_target_element_id_idx" ON "element_relationships"("target_element_id");

-- CreateIndex
CREATE UNIQUE INDEX "craft_recipes_input_hash_key" ON "craft_recipes"("input_hash");

-- CreateIndex
CREATE INDEX "craft_recipe_inputs_element_id_idx" ON "craft_recipe_inputs"("element_id");

-- CreateIndex
CREATE UNIQUE INDEX "craft_recipe_inputs_recipe_id_input_order_key" ON "craft_recipe_inputs"("recipe_id", "input_order");

-- CreateIndex
CREATE INDEX "user_elements_element_id_idx" ON "user_elements"("element_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_elements_user_id_element_id_key" ON "user_elements"("user_id", "element_id");

-- CreateIndex
CREATE INDEX "discovery_events_user_id_discovered_at_idx" ON "discovery_events"("user_id", "discovered_at");

-- CreateIndex
CREATE INDEX "discovery_events_recipe_id_idx" ON "discovery_events"("recipe_id");

-- CreateIndex
CREATE INDEX "discovery_events_result_element_id_idx" ON "discovery_events"("result_element_id");

-- CreateIndex
CREATE INDEX "workspaces_user_id_status_idx" ON "workspaces"("user_id", "status");

-- CreateIndex
CREATE INDEX "workspace_nodes_workspace_id_idx" ON "workspace_nodes"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_nodes_element_id_idx" ON "workspace_nodes"("element_id");

-- CreateIndex
CREATE INDEX "workspace_edges_workspace_id_idx" ON "workspace_edges"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_edges_source_node_id_idx" ON "workspace_edges"("source_node_id");

-- CreateIndex
CREATE INDEX "workspace_edges_target_node_id_idx" ON "workspace_edges"("target_node_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulations_simulation_type_key" ON "simulations"("simulation_type");

-- CreateIndex
CREATE INDEX "simulations_linked_element_id_idx" ON "simulations"("linked_element_id");

-- CreateIndex
CREATE INDEX "simulation_runs_user_id_created_at_idx" ON "simulation_runs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "simulation_runs_simulation_id_idx" ON "simulation_runs"("simulation_id");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elements" ADD CONSTRAINT "elements_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "element_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_details" ADD CONSTRAINT "discovery_details_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_relationships" ADD CONSTRAINT "element_relationships_source_element_id_fkey" FOREIGN KEY ("source_element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_relationships" ADD CONSTRAINT "element_relationships_target_element_id_fkey" FOREIGN KEY ("target_element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_recipes" ADD CONSTRAINT "craft_recipes_output_element_id_fkey" FOREIGN KEY ("output_element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_recipe_inputs" ADD CONSTRAINT "craft_recipe_inputs_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "craft_recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_recipe_inputs" ADD CONSTRAINT "craft_recipe_inputs_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_elements" ADD CONSTRAINT "user_elements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_elements" ADD CONSTRAINT "user_elements_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_events" ADD CONSTRAINT "discovery_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_events" ADD CONSTRAINT "discovery_events_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "craft_recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_events" ADD CONSTRAINT "discovery_events_result_element_id_fkey" FOREIGN KEY ("result_element_id") REFERENCES "elements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_nodes" ADD CONSTRAINT "workspace_nodes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_nodes" ADD CONSTRAINT "workspace_nodes_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_edges" ADD CONSTRAINT "workspace_edges_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_edges" ADD CONSTRAINT "workspace_edges_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "workspace_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_edges" ADD CONSTRAINT "workspace_edges_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "workspace_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_linked_element_id_fkey" FOREIGN KEY ("linked_element_id") REFERENCES "elements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_runs" ADD CONSTRAINT "simulation_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_runs" ADD CONSTRAINT "simulation_runs_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
