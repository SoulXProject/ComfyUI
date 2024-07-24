# CUDA 기반 이미지 사용 (CUDA 11.8, Ubuntu 22.04)
FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=America/Los_Angeles

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Clone ComfyUI repository
RUN git clone https://github.com/comfyanonymous/ComfyUI.git .

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu118

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Set environment variables for ComfyUI
ENV PYTHON_VERSION=3.10 \
    PYTORCH_VERSION=2.2.1 \
    COMFYUI_SHA=latest

# Create directories for models
RUN mkdir -p /app/models/checkpoints /app/models/vae

# Run initialization script
CMD ["python3", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
