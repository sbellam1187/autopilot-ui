# Open Multi-Agent Canvas

Open Multi-Agent Canvas is an open-source multi-agent chat interface that leverages specialized agents to assist with travel planning, research, email drafting, and more. Built with Next.js, React, and CopilotKit, this project offers an interactive, unified experience by managing multiple agents within one dynamic conversation.

## Key Features

- **Multi-Agent Chat Interface:**
  Chat with a range of specialized agents:

  - **Travel Agent:** Plan trips, create itineraries, and view travel recommendations on an interactive map powered by Leaflet.
  - **Research Agent:** Conduct research with real-time logs and progress updates.

- **Real-Time Interactivity:**
  Enjoy a live chat powered by `@copilotkit/react-ui` that orchestrates dynamic state changes and agent responses.

- **State Management & Agent Coordination:**
  Leverages `@copilotkit/react-core` for robust agent state management and smooth integration of travel and research functionalities.

- **Responsive & Modern UI:**
  Designed with Tailwind CSS to ensure your experience is smooth and adaptive across all devices.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org)
- **UI Library:** React, [CopilotKit UI](https://www.npmjs.com/package/@copilotkit/react-ui)
- **State Management:** [CopilotKit React Core](https://www.npmjs.com/package/@copilotkit/react-core)
- **Mapping:** [Leaflet](https://leafletjs.com) with [React Leaflet](https://react-leaflet.js.org)
- **Styling:** Tailwind CSS

## Quick Start using Docker Compose (ui, agents, and internal mcp server)

1. **Prerequisites:**

   - docker or podman
   - github pat token with necessary permissions like `models

2. **Docker login (one-time)**

   ```bash
   docker login docker.aa.com
   username -> username from cloudsmith
   password -> apikey from cloudsmith
   ```

3. **Setup:**

   ```bash
   # Clone the repository
   git clone <repository-url>
   ```

   - Copy example.env to .env and update variables accordingly:

   ```bash
   cp example.env .env
   ```

   **Required Environment Variables:**

   ```bash
   # LLM Configuration
   OPENAI_API_KEY=<your-github-token-with-models-scope>
   OPENAI_MODEL=openai/gpt-4.1  # or your preferred model

   # API Configuration
   GRAPHQL_API_TOKEN=<test-apigee-or-sam-token>

   # Authentication (if using auth features)
   AUTH_CLIENT_ID=<your-auth-client-id>
   AUTH_CLIENT_SECRET=<your-auth-client-secret>
   NEXTAUTH_SECRET=<generate-a-secure-random-string>

   # Database Configuration (if using database features)
   JDBC_URL=postgresql://username:password@postgres:5432/username?sslmode=disable

   # RAG Configuration (if using RAG features)
   GITHUB_TOKEN=ghp_your_github_token_here
   ```

   **Optional Configuration:**

   - **LLM Provider**: Choose between OpenAI (`openai`) or local Ollama (`ollama`) by setting `LLM_PROVIDER`
   - **Azure Authentication**: For Azure PostgreSQL, set `DB_AUTH_METHOD=service_principal` and configure Azure service principal credentials
   - **Debugging**: Enable debug modes for specific agents using the debug flags
   - **RAG Features**: Configure vector embeddings and document processing settings

4. **Run the Application:**
   ```bash
   docker-compose up
   # or
   podman compose up
   ```
   Then, open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `example.env` to `.env` and configure the following:

#### LLM Configuration

- **`LLM_PROVIDER`**: Choose `openai` for OpenAI models or `ollama` for local models
- **`OPENAI_API_KEY`**: Your GitHub token with models scope (required for OpenAI)
- **`OPENAI_MODEL`**: Model to use (default: `openai/gpt-4.1`)
- **`OPENAI_BASE_URL`**: OpenAI API base URL (default: `https://models.github.ai/inference`)
- **`OLLAMA_MODEL`**: Ollama model name (default: `qwen3`)
- **`OLLAMA_BASE_URL`**: Ollama server URL (default: `http://host.docker.internal:11434`)

#### API Configuration

- **`REMOTE_ACTION_URL`**: CopilotKit agents endpoint (default: `http://agents:8000/copilotkit`)
- **`AA_GRAPH_MCP_SERVER_URL`**: MCP server URL (default: `http://host.docker.internal:8002/sse`)
- **`GRAPHQL_API_TOKEN`**: API token for GraphQL requests
- **`GRAPHQL_CLIENT_NAME`**: Client name for GraphQL (default: `apimgmtgql`)

#### Authentication Configuration

- **`AUTH_WELLKNOWN`**: OpenID Connect well-known configuration URL
- **`AUTH_CLIENT_ID`**: OAuth client ID
- **`AUTH_CLIENT_SECRET`**: OAuth client secret
- **`NEXTAUTH_URL`**: NextAuth URL (default: `http://localhost:3000`)
- **`NEXTAUTH_SECRET`**: Secret for NextAuth session encryption

#### Database Configuration

- **`DB_AUTH_METHOD`**: Set to `basic` for username/password or `service_principal` for Azure AD
- **`JDBC_URL`**: PostgreSQL connection string
- **Azure Service Principal** (when `DB_AUTH_METHOD=service_principal`):
  - `ARM_CLIENT_ID`: Azure client ID
  - `ARM_CLIENT_SECRET`: Azure client secret
  - `ARM_TENANT_ID`: Azure tenant ID

#### RAG Configuration

- **`VECTOR_TABLE_NAME`**: Table name for document embeddings (default: `document_embeddings`)
- **`GITHUB_TOKEN`**: GitHub token for repository access
- **`SUPPORTED_EXTENSIONS`**: File extensions to process (default: `.md`)
- **`EMBEDDING_MODEL`**: Embedding model name (default: `mxbai-embed-large`)
- **`EMBEDDING_BASE_URL`**: Embedding service URL (default: `http://host.docker.internal:11434`)

#### Debugging

Enable debug logging for specific agents:

- **`SUPERVISOR_AGENT_DEBUG`**: Debug supervisor agent
- **`SAMPLE_AGENT_DEBUG`**: Debug sample agent
- **`MCP_AGENT_DEBUG`**: Debug MCP agent
- **`RAG_AGENT_DEBUG`**: Debug RAG agent

## Setup Instructions (ui only)

1. **Prerequisites:**

   - [Node.js](https://nodejs.org) (LTS version recommended)
   - pnpm or yarn

2. **Installation:**

   ```bash
   # Clone the repository
   git clone <repository-url>

   # Install dependencies
   pnpm install
   # or
   yarn install
   ```

3. **Running the Development Server:**
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```
   Then, open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- **/src/app:**
  Contains Next.js page components, layouts, and global styles.

- **/src/components:**
  Houses reusable components including agent interfaces (Travel, Research, Chat, Map, Sidebar) and UI elements.

- **/providers:**
  Wraps the global state providers responsible for managing agent states.

- **/lib:**
  Contains utility functions and configuration files (like available agents configuration).

## Value Proposition

Open Multi-Agent Canvas simplifies complex tasks by unifying multiple specialized agents in a single, interactive chat interface. Whether you're planning a trip with an interactive map, conducting in-depth research with real-time logs, this application streamlines your workflow and provides focused assistance tailored to each task—all within one platform.

## Deployment

The easiest way to deploy this project is with [Vercel](https://vercel.com). Build and start your application with:

```bash
pnpm run build
pnpm run start
```

Follow Vercel's deployment guide for more details if needed.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with any improvements, bug fixes, or new features.

## License

Distributed under the MIT License. See `LICENSE` for more information.
