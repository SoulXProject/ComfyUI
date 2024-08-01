# CUDA 기반 이미지 사용 (CUDA 11.8, Ubuntu 22.04)
FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=America/Los_Angeles

# Set environment variables for ComfyUI
ENV PYTHON_VERSION=3.10 \
PYTORCH_VERSION=2.2.1 \
COMFYUI_SHA=latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    python3 \
    python3-pip \
    ffmpeg libsm6 libxext6 cmake libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu118

# Clone ComfyUI repository
RUN git clone https://github.com/SoulXProject/ComfyUI.git /app/comfyui

# Copy the requirements.txt file into the container
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Set working directory
WORKDIR /app/comfyui

# Run initialization script
CMD ["python3", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
