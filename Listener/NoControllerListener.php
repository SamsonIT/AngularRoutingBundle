<?php

namespace Samson\Bundle\AngularRoutingBundle\Listener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Kernel;

class NoControllerListener {
    private $twig;

    public function __construct(\Twig_Environment $twig)
    {
        $this->twig = $twig;
    }

    public function onKernelController(FilterControllerEvent $e) {
        if ($e->getRequestType() == Kernel::SUB_REQUEST) {
            return;
        }
        if (!$e->getRequest()->isXmlHttpRequest() && $e->getRequest()->getRequestFormat('html') == 'html') {
            $e->setController(function() {
                return new Response($this->twig->render('::base.html.twig'));
            });
        }
    }
}