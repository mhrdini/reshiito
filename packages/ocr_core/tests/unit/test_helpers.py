import pytest


def test_bytes_to_image(helper_module, sample_bytes):
    image = helper_module.bytes_to_image(sample_bytes)
    assert isinstance(image, helper_module.Image.Image)
    assert image.mode == "RGB"
    assert image.size == (10, 10)


def test_bytes_to_image_invalid_input(helper_module):
    """Negative test: ensure invalid bytes raise an error"""
    invalid_bytes = b"not_a_real_image"
    try:
        helper_module.bytes_to_image(invalid_bytes)
    except Exception as e:
        assert isinstance(e, (ValueError, OSError))
    else:
        pytest.fail("Expected exception not raised for invalid bytes")


def test_base64_to_image(helper_module, sample_base64):
    image = helper_module.base64_to_image(sample_base64)
    assert isinstance(image, helper_module.Image.Image)
    assert image.mode == "RGB"
    assert image.size == (10, 10)


def test_base64_to_image_invalid_input(helper_module):
    """Negative test: ensure invalid base64 raises ValueError"""
    invalid_b64 = "not_a_real_image"
    with pytest.raises(ValueError, match="Invalid base64 string"):
        helper_module.base64_to_image(invalid_b64)


def test_ensure_rgb(helper_module, sample_image):
    # Create a grayscale image
    gray_image = sample_image.convert("L")
    rgb_image = helper_module.ensure_rgb(gray_image)
    assert rgb_image.mode == "RGB"

    # Create an RGB image
    same_rgb_image = helper_module.ensure_rgb(sample_image)
    assert same_rgb_image.mode == "RGB"
    assert same_rgb_image == sample_image


def test_resize_large_image(helper_module):
    # Create a large image exceeding max dimensions
    large_image = helper_module.Image.new("RGB", (5000, 3000))
    resized_image = helper_module.resize_large_image(large_image)
    assert resized_image.size[0] <= helper_module.MAX_IMAGE_WIDTH
    assert resized_image.size[1] <= helper_module.MAX_IMAGE_HEIGHT

    # Create an image within max dimensions
    small_image = helper_module.Image.new("RGB", (3000, 2000))
    same_size_image = helper_module.resize_large_image(small_image)
    assert same_size_image.size == small_image.size
